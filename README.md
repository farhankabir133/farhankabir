# AI Assistant Chatbot for Portfolio Website

A next-generation AI assistant chatbot integrated into Farhan Kabir's portfolio website with modern UX, Web3 features, and comprehensive analytics.

## 🚀 Features

### Core Functionality
- **AI-Powered Conversations**: GPT-4o-mini integration for intelligent responses about portfolio, skills, and projects
- **Context Memory**: Maintains conversation context for better follow-up responses
- **Voice Input/Output**: Speech recognition and text-to-speech capabilities
- **Lead Collection**: Secure capture and storage of visitor contact information

### Modern UX/UI
- **Glassmorphism Design**: Beautiful translucent chat interface
- **Lottie Animations**: Smooth animated chatbot icon
- **Dark/Light Mode**: Automatic theme adaptation
- **Responsive Design**: Works seamlessly on all devices
- **Floating Action Button**: Unobtrusive access point

### Web3 Integration
- **Wallet Connection**: MetaMask and other wallet support
- **Identity Verification**: Optional wallet-based authentication
- **NFT/Badge System**: Reward system for user engagement
- **Decentralized Ready**: Built with Web3 infrastructure in mind

### Analytics & Admin
- **Real-time Analytics**: Track interactions, leads, and user behavior
- **Admin Dashboard**: Comprehensive metrics and lead management
- **Export Functionality**: CSV export of leads and analytics data
- **Performance Monitoring**: Conversion rates and engagement metrics

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Framer Motion** for animations
- **Tailwind CSS** for styling
- **Lottie React** for animations
- **React Speech Kit** for voice features

### Backend & Database
- **Supabase** for database and real-time features
- **PostgreSQL** with Row Level Security
- **OpenAI API** for AI responses

### Web3
- **Wagmi** for wallet connections
- **Web3Modal** for wallet UI
- **Viem** for Ethereum interactions

## 📦 Installation & Setup

### 1. Environment Variables

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here

# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# WalletConnect Project ID (for Web3 integration)
VITE_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here

# Analytics (optional)
VITE_PLAUSIBLE_DOMAIN=your_domain_here
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration file to create the required tables:
   ```sql
   -- Copy and paste the contents of supabase/migrations/create_chatbot_tables.sql
   -- into your Supabase SQL editor and run it
   ```

### 3. OpenAI API Setup

1. Get your API key from [OpenAI Platform](https://platform.openai.com)
2. Add it to your `.env` file
3. Ensure you have sufficient credits for API calls

### 4. Web3 Setup (Optional)

1. Create a project at [WalletConnect Cloud](https://cloud.walletconnect.com)
2. Get your Project ID and add it to `.env`
3. Configure supported chains in `src/lib/web3.ts`

### 5. Install Dependencies

```bash
npm install
```

### 6. Run Development Server

```bash
npm run dev
```

## 🔧 Configuration

### Customizing AI Responses

Edit the `SYSTEM_PROMPT` in `src/lib/openai.ts` to customize how the AI responds:

```typescript
const SYSTEM_PROMPT = `You are Farhan Kabir's AI assistant...
// Add your custom instructions here
`;
```

### Adding New Badge Types

Add new badges in `src/lib/web3.ts`:

```typescript
export const AVAILABLE_BADGES: Badge[] = [
  {
    id: 'new_badge',
    name: 'Badge Name',
    description: 'Badge description',
    image: '/badges/badge.svg',
    criteria: 'Criteria for earning this badge'
  },
  // ... existing badges
];
```

### Customizing Analytics Events

Track custom events using the analytics service:

```typescript
import { analytics } from '../lib/analytics';

// Track custom event
analytics.track('custom_event', {
  property1: 'value1',
  property2: 'value2'
});
```

## 🚀 Deployment

### Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Netlify Deployment

1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

### Custom Server Deployment

For production with backend API routes, consider:
- **Railway**: Easy deployment with database
- **Render**: Full-stack deployment
- **DigitalOcean App Platform**: Scalable hosting

## 📊 Analytics Dashboard

Access the admin dashboard by clicking the eye icon in the bottom-left corner. Features include:

- **Real-time Metrics**: Messages, sessions, leads, wallet connections
- **Lead Management**: View and export lead information
- **Performance Analytics**: Conversion rates and engagement metrics
- **Time-based Filtering**: 24h, 7d, 30d views

## 🔒 Security Best Practices

### API Key Protection
- Never expose OpenAI API keys in frontend code
- Use environment variables for all sensitive data
- Consider implementing a backend proxy for API calls

### Database Security
- Row Level Security (RLS) is enabled on all tables
- Public access is limited to necessary operations
- Sensitive lead data requires authentication

### Rate Limiting
Implement rate limiting to prevent abuse:

```typescript
// Example rate limiting logic
const rateLimiter = {
  requests: new Map(),
  limit: 10, // requests per minute
  window: 60000 // 1 minute
};
```

## 🎨 Customization

### Theming
Customize colors in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#your-primary-color',
        600: '#your-primary-dark',
      }
    }
  }
}
```

### Animations
Add custom Lottie animations by replacing the animation data in `ChatbotIcon.tsx`.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Email: farhankabir133@gmail.com
- GitHub Issues: [Create an issue](https://github.com/farhankabir133/portfolio/issues)

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Advanced NLP for better intent recognition
- [ ] Integration with calendar for meeting scheduling
- [ ] Custom AI model fine-tuning
- [ ] Advanced Web3 features (token gating, DAO integration)
- [ ] Mobile app version
- [ ] Advanced analytics with ML insights

---

Built with ❤️ by [Farhan Kabir](https://farhankabir.netlify.app)