# Admin Dashboard

A modern, clean admin dashboard built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui.

## Tech Stack

- **Next.js 14+** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful, accessible UI components
- **TanStack Query** - Powerful data fetching and caching
- **next-themes** - Dark mode support
- **Lucide React** - Modern icon library

## Features

- ✨ Modern, clean design
- 🎨 Dark mode support
- 📱 Responsive layout with mobile-friendly sidebar
- 🧩 Modular component structure
- 🎯 Type-safe with TypeScript
- 🚀 Optimized performance

## Getting Started

### Installation

```bash
npm install
```

### Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
│   ├── layout.tsx      # Root layout with providers
│   └── page.tsx        # Dashboard page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── header.tsx     # Top header with search and user menu
│   ├── sidebar.tsx    # Navigation sidebar
│   ├── theme-provider.tsx
│   ├── theme-toggle.tsx
│   └── providers.tsx  # TanStack Query provider
└── lib/
    └── utils.ts       # Utility functions
```

## Customization

### Adding New Pages

Create new pages in the `src/app` directory following Next.js App Router conventions.

### Adding Navigation Items

Edit the `menuItems` array in `src/components/sidebar.tsx`:

```typescript
const menuItems = [
  {
    title: "Your Page",
    href: "/your-page",
    icon: YourIcon,
  },
  // ...
]
```

### Theme Customization

Modify colors in `src/app/globals.css` or use the shadcn/ui theme customization.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## License

MIT

