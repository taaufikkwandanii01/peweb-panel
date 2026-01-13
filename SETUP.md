# Setup & Troubleshooting Guide

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: Version 18.17 or later
- **npm/yarn/pnpm**: Latest version
- **Git**: For version control

## 🚀 Initial Setup

### 1. Install Dependencies

```bash
npm install
```

Required packages:
- next (14.x)
- react (18.x)
- react-dom (18.x)
- typescript
- tailwindcss
- autoprefixer
- postcss

### 2. Configure Tailwind CSS

Ensure `tailwind.config.js` exists:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Ensure `postcss.config.js` exists:

```js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### 3. TypeScript Configuration

Ensure `tsconfig.json` has proper path aliases:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 4. Environment Variables (Optional)

Create `.env.local` for environment-specific variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Admin Panel
```

### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## 🔧 Common Issues & Solutions

### Issue 1: Module not found '@/components/...'

**Problem**: Path alias not recognized

**Solution**:
1. Check `tsconfig.json` has the paths configuration
2. Restart your IDE/editor
3. Restart the development server

```bash
# Stop the server (Ctrl+C)
npm run dev
```

### Issue 2: Tailwind styles not applying

**Problem**: CSS classes not working

**Solution**:
1. Ensure `globals.css` imports Tailwind directives:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

2. Verify `tailwind.config.js` content paths are correct
3. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```

### Issue 3: TypeScript errors in components

**Problem**: Type errors in props or state

**Solution**:
1. Ensure all interfaces are properly defined
2. Use proper React types:
```tsx
import React from 'react';

interface Props {
  children: React.ReactNode;
}
```

3. Check for missing dependencies:
```bash
npm install --save-dev @types/react @types/node
```

### Issue 4: useRouter not working

**Problem**: `useRouter` is undefined

**Solution**:
1. Import from correct package:
```tsx
// Correct for App Router
import { useRouter } from 'next/navigation';

// Old (Pages Router)
// import { useRouter } from 'next/router';
```

2. Ensure component is marked as 'use client':
```tsx
'use client';

import { useRouter } from 'next/navigation';
```

### Issue 5: Images not loading

**Problem**: Next.js Image component errors

**Solution**:
1. Configure `next.config.js`:
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-image-domain.com'],
  },
}

module.exports = nextConfig
```

### Issue 6: Build errors

**Problem**: Production build fails

**Solution**:
1. Check for console.log statements (remove or comment)
2. Ensure all imports are used
3. Fix any TypeScript errors
4. Clear build cache:
```bash
rm -rf .next
npm run build
```

### Issue 7: Port already in use

**Problem**: Port 3000 is already in use

**Solution**:
1. Kill the process using port 3000:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill
```

2. Or use a different port:
```bash
PORT=3001 npm run dev
```

### Issue 8: Hydration errors

**Problem**: Text content does not match server-rendered HTML

**Solution**:
1. Ensure dynamic content (like dates) is consistent
2. Use `suppressHydrationWarning` for unavoidable cases:
```tsx
<div suppressHydrationWarning>
  {new Date().toLocaleDateString()}
</div>
```

3. Use client components for dynamic content:
```tsx
'use client';
```

## 🎯 Performance Optimization

### 1. Image Optimization

Use Next.js Image component:
```tsx
import Image from 'next/image';

<Image
  src="/your-image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority // for above-the-fold images
/>
```

### 2. Code Splitting

Next.js automatically code-splits. For additional optimization:
```tsx
import dynamic from 'next/dynamic';

const DynamicComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false, // disable server-side rendering if needed
});
```

### 3. Font Optimization

Already implemented with `next/font`:
```tsx
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });
```

### 4. Metadata Optimization

Add proper metadata for SEO:
```tsx
export const metadata: Metadata = {
  title: 'Your Page Title',
  description: 'Your page description',
  keywords: ['keyword1', 'keyword2'],
};
```

## 🔒 Security Best Practices

### 1. Environment Variables

Never commit `.env.local` to Git:
```gitignore
.env*.local
.env
```

### 2. Input Validation

Always validate user input:
```tsx
const validateEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};
```

### 3. XSS Prevention

Next.js automatically escapes content, but be careful with:
- `dangerouslySetInnerHTML`
- External scripts
- User-generated content

### 4. CSRF Protection

Implement CSRF tokens for forms:
```tsx
// Will be needed when integrating with backend
<input type="hidden" name="_csrf" value={csrfToken} />
```

## 📱 Mobile Testing

### Testing on Physical Devices

1. Find your local IP:
```bash
# Windows
ipconfig

# Mac/Linux
ifconfig
```

2. Access from mobile device:
```
http://YOUR_IP:3000
```

### Browser DevTools

1. Open Chrome DevTools (F12)
2. Click "Toggle device toolbar" (Ctrl+Shift+M)
3. Select device preset or custom dimensions

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project on Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t admin-panel .
docker run -p 3000:3000 admin-panel
```

## 📊 Monitoring & Debugging

### Development Tools

1. **React DevTools**: Browser extension for React debugging
2. **Next.js DevTools**: Built into Next.js
3. **Tailwind CSS IntelliSense**: VS Code extension

### Console Logging

```tsx
console.log('Debug:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### Error Boundaries

Create error boundary for production:
```tsx
'use client';

import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
```

## 🆘 Getting Help

### Resources

1. **Next.js Documentation**: https://nextjs.org/docs
2. **React Documentation**: https://react.dev
3. **Tailwind CSS**: https://tailwindcss.com/docs
4. **TypeScript**: https://www.typescriptlang.org/docs

### Community

- Stack Overflow: Tag questions with `next.js`, `react`, `tailwindcss`
- Next.js Discord: https://nextjs.org/discord
- GitHub Issues: For project-specific issues

## 📝 Checklist

Before considering the setup complete:

- [ ] All dependencies installed
- [ ] Development server runs without errors
- [ ] All pages load correctly
- [ ] Authentication flow works
- [ ] Forms validate properly
- [ ] Responsive design works on mobile
- [ ] No console errors
- [ ] TypeScript compiles without errors
- [ ] Build succeeds (`npm run build`)
- [ ] Production mode works (`npm start`)

## 🎓 Next Steps

After setup is complete:

1. **Integrate Backend API**
   - Set up API routes in `app/api/`
   - Connect to database
   - Implement authentication

2. **Add State Management**
   - Consider Redux, Zustand, or Context API
   - Implement global state for user data

3. **Testing**
   - Set up Jest and React Testing Library
   - Write unit tests for components
   - Add E2E tests with Playwright

4. **Analytics**
   - Add Google Analytics
   - Implement error tracking (Sentry)

5. **Optimization**
   - Add caching strategies
   - Implement service workers
   - Optimize bundle size

---

Need more help? Check the main README.md or COMPONENTS.md documentation files.
