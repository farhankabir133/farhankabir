import { supabase } from './supabase';
import { AnalyticsEvent } from '../types/chatbot';

class AnalyticsService {
  private sessionId: string;
  private events: AnalyticsEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async track(event: string, properties: Record<string, any> = {}): Promise<void> {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      },
      timestamp: new Date()
    };

    this.events.push(analyticsEvent);

    try {
      await supabase
        .from('analytics_events')
        .insert({
          event: analyticsEvent.event,
          properties: analyticsEvent.properties,
          session_id: this.sessionId,
          timestamp: analyticsEvent.timestamp.toISOString()
        });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }

    // Also send to Plausible if configured
    if (import.meta.env.VITE_PLAUSIBLE_DOMAIN) {
      this.trackPlausible(event, properties);
    }
  }

  private trackPlausible(event: string, properties: Record<string, any>): void {
    try {
      // @ts-ignore
      if (window.plausible) {
        // @ts-ignore
        window.plausible(event, { props: properties });
      }
    } catch (error) {
      console.error('Plausible tracking error:', error);
    }
  }

  async getChatbotMetrics(): Promise<any> {
    try {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .in('event', [
          'chatbot_opened',
          'message_sent',
          'lead_captured',
          'voice_used',
          'wallet_connected'
        ])
        .gte('timestamp', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;

      return this.processMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return null;
    }
  }

  private processMetrics(events: any[]): any {
    const metrics = {
      totalInteractions: events.length,
      uniqueSessions: new Set(events.map(e => e.session_id)).size,
      messagesSent: events.filter(e => e.event === 'message_sent').length,
      leadsGenerated: events.filter(e => e.event === 'lead_captured').length,
      voiceUsage: events.filter(e => e.event === 'voice_used').length,
      walletConnections: events.filter(e => e.event === 'wallet_connected').length,
      dailyStats: this.groupByDay(events)
    };

    return metrics;
  }

  private groupByDay(events: any[]): Record<string, number> {
    const dailyStats: Record<string, number> = {};
    
    events.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      dailyStats[date] = (dailyStats[date] || 0) + 1;
    });

    return dailyStats;
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

export const analytics = new AnalyticsService();