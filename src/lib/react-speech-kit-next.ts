import { useState, useEffect, useCallback, useRef } from 'react';

// Types for React Speech Kit Next compatibility
export interface SpeechSynthesisHook {
  speak: (options: { text: string; voice?: SpeechSynthesisVoice; rate?: number; pitch?: number; volume?: number }) => void;
  cancel: () => void;
  speaking: boolean;
  supported: boolean;
  voices: SpeechSynthesisVoice[];
}

export interface SpeechRecognitionHook {
  listen: (options?: { continuous?: boolean; interimResults?: boolean }) => void;
  listening: boolean;
  stop: () => void;
  supported: boolean;
}

export interface SpeechRecognitionOptions {
  onResult?: (result: string) => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}

// Speech Synthesis Hook - React 18 compatible
export function useSpeechSynthesis(): SpeechSynthesisHook {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);
      
      const updateVoices = () => {
        setVoices(window.speechSynthesis.getVoices());
      };

      updateVoices();
      window.speechSynthesis.addEventListener('voiceschanged', updateVoices);

      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      };
    }
  }, []);

  const speak = useCallback((options: { text: string; voice?: SpeechSynthesisVoice; rate?: number; pitch?: number; volume?: number }) => {
    if (!supported) return;

    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(options.text);
    
    if (options.voice) utterance.voice = options.voice;
    if (options.rate) utterance.rate = options.rate;
    if (options.pitch) utterance.pitch = options.pitch;
    if (options.volume) utterance.volume = options.volume;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    setSpeaking(true);
    window.speechSynthesis.speak(utterance);
  }, [supported]);

  const cancel = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return {
    speak,
    cancel,
    speaking,
    supported,
    voices
  };
}

// Speech Recognition Hook - React 18 compatible
export function useSpeechRecognition(options: SpeechRecognitionOptions = {}): SpeechRecognitionHook {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setSupported(true);
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = options.continuous || false;
      recognition.interimResults = options.interimResults || false;
      recognition.lang = options.lang || 'en-US';

      recognition.onresult = (event: any) => {
        const result = event.results[event.results.length - 1];
        if (result.isFinal && options.onResult) {
          options.onResult(result[0].transcript);
        }
      };

      recognition.onend = () => {
        setListening(false);
        if (options.onEnd) {
          options.onEnd();
        }
      };

      recognition.onerror = (error: any) => {
        setListening(false);
        if (options.onError) {
          options.onError(error);
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [options.continuous, options.interimResults, options.lang]);

  const listen = useCallback((listenerOptions?: { continuous?: boolean; interimResults?: boolean }) => {
    if (!supported || !recognitionRef.current) return;

    const recognition = recognitionRef.current;
    if (listenerOptions?.continuous !== undefined) {
      recognition.continuous = listenerOptions.continuous;
    }
    if (listenerOptions?.interimResults !== undefined) {
      recognition.interimResults = listenerOptions.interimResults;
    }

    setListening(true);
    recognition.start();
  }, [supported]);

  const stop = useCallback(() => {
    if (!supported || !recognitionRef.current) return;
    recognitionRef.current.stop();
    setListening(false);
  }, [supported]);

  return {
    listen,
    listening,
    stop,
    supported
  };
}