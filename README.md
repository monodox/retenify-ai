# Retenify AI

Retenify AI is an autonomous business, revenue, and market intelligence platform that helps companies understand what is happening in their business, why it is happening, and what to do next.

## Project Structure

```
retenify/
├── .next/                      # Next.js build output
├── src/
│   ├── app/
│   │   ├── api/                # API routes
│   │   │   ├── chat/
│   │   │   │   ├── [chatId]/
│   │   │   │   │   └── route.ts
│   │   │   │   └── route.ts
│   │   │   └── chats/
│   │   │       └── route.ts
│   │   ├── auth/               # Authentication pages
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── organization/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   ├── signup/
│   │   │   │   └── page.tsx
│   │   │   ├── verify-email/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── console/            # Main dashboard
│   │   │   ├── agents/
│   │   │   │   └── page.tsx
│   │   │   ├── chat/
│   │   │   │   ├── [chatId]/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── help/
│   │   │   │   └── page.tsx
│   │   │   ├── knowledge/
│   │   │   │   └── page.tsx
│   │   │   ├── library/
│   │   │   │   └── page.tsx
│   │   │   ├── settings/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── legal/              # Legal pages
│   │   │   ├── cookies/
│   │   │   │   └── page.tsx
│   │   │   ├── privacy/
│   │   │   │   └── page.tsx
│   │   │   ├── terms/
│   │   │   │   └── page.tsx
│   │   │   └── layout.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── app/
│   │   │   ├── app-footer.tsx
│   │   │   └── app-header.tsx
│   │   ├── console/
│   │   │   ├── console-header.tsx
│   │   │   ├── console-sidebar.tsx
│   │   │   └── index.ts
│   │   └── ui/                 # shadcn/ui components
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── separator.tsx
│   │       └── textarea.tsx
│   └── lib/
│       ├── chat-storage.ts     # Chat persistence
│       ├── genkit.ts          # AI integration
│       └── utils.ts           # Utilities
├── .env.example               # Environment template
├── .env.local                 # Local environment (not in git)
├── .gitignore
├── CHANGELOG.md
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── LICENSE
├── README.md
├── SECURITY.md
├── eslintrc.json
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- ⚡ Next.js 14 with App Router
- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS + shadcn/ui components
- 💬 AI-powered chat interface
- 🔐 Supabase authentication
- 🗄️ PostgreSQL database (Supabase)
- 📄 Legal pages (Terms, Privacy, Cookies)

## Environment Setup

### Prerequisites

- Node.js 20+ 
- npm/yarn/pnpm
- Google Gemini API key (get from [Google AI Studio](https://aistudio.google.com/))
- Supabase project (get from [Supabase](https://supabase.com))

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/retenify-ai.git
   cd retenify-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

## Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/docs) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **AI**: Google Gemini via Genkit
- **Database**: [Supabase](https://supabase.com) (PostgreSQL)
- **Authentication**: Supabase Auth

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.nterfaces
3. Register with orchestrator
4. Add tests
5. Update documentation

```typescript
// Example agent structure
export class CustomAgent implements Agent {
  async process(input: AgentInput): Promise<AgentOutput> {
    // Agent logic here
  }
}
```

## Deployment

### Vercel (Recommended)

1. **Connect repository to Vercel**
2. **Configure environment variables**
3. **Deploy**
   ```bash
   vercel --prod
   ```

### Docker

```dockerfile
# Dockerfile included in project
docker build -t retenify-ai .
docker run -p 3000:3000 retenify-ai
```

### Environment-Specific Configurations

- **Development**: Full logging, debug mode
- **Staging**: Production-like with test data
- **Production**: Optimized performance, monitoring

## Performance Optimization

### Agent Performance
- **Parallel Processing**: Agents run concurrently when possible
- **Caching**: Intelligent caching of agent results
- **Load Balancing**: Distribute agent workload
- **Resource Management**: Memory and CPU optimization

### Frontend Performance
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: Next.js automatic optimization
- **Bundle Analysis**: Regular bundle size monitoring
- **Caching Strategy**: Aggressive caching for static assets

## Monitoring & Analytics

### Built-in Monitoring
- Agent performance metrics
- User interaction tracking
- Error logging and alerting
- Business metric dashboards

### Integration Options
- Google Analytics
- Mixpanel
- Sentry (error tracking)
- DataDog (infrastructure)

## Security

### Data Protection
- End-to-end encryption
- Secure API endpoints
- Input validation and sanitization
- Rate limiting

### Authentication
- Multi-factor authentication
- Role-based access control
- Session management
- OAuth integration

## Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/docs) with App Router
- **Language**: TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com)
- **Components**: [shadcn/ui](https://ui.shadcn.com)
- **Icons**: [Lucide React](https://lucide.dev)
- **AI**: Google Gemini 3 via Genkit
- **Authentication**: Custom auth system

## Contributing

### Development Guidelines

1. **Code Style**: Follow ESLint and Prettier configurations
2. **Commit Messages**: Use conventional commit format
3. **Testing**: Maintain test coverage above 80%
4. **Documentation**: Update docs with new features

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Code review and approval
6. Merge to main

### Issue Reporting

Use GitHub issues with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Environment details

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation**: [docs.retenify.ai](https://docs.retenify.ai)
- **Community**: [Discord](https://discord.gg/retenify)
- **Email**: support@retenify.ai
- **Enterprise**: enterprise@retenify.ai