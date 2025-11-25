# MovieMonk - Movie & TV Show Discovery Platform

A modern, feature-rich web application for discovering and exploring movies and TV shows, built with Next.js 14, React, TypeScript, and Tailwind CSS.

## 🚀 Features

### Core Features
- **🔍 Advanced Search**: Search for movies and TV shows with real-time results
- **🎬 Detailed Pages**: Comprehensive movie/TV show details with cast, crew, trailers, and more
- **❤️ Watchlist**: Save your favorite content to a personal watchlist (localStorage-based)
- **🎨 Theme Support**: Dark/Light mode with multiple font options
- **📱 Responsive Design**: Fully responsive UI that works on all devices
- **🎯 Filtering & Sorting**: Advanced filters by genre, rating, year, and more

### User Experience
- **🔐 Authentication**: Simple authentication system (demo implementation)
- **⚡ Performance**: Optimized images with Next.js Image component
- **♿ Accessibility**: ARIA labels, semantic HTML, and keyboard navigation
- **🎭 Error Handling**: Comprehensive error boundaries for graceful failures
- **🌐 SEO Optimized**: Meta tags, OpenGraph, and Twitter cards

### Technical Features
- **📊 TMDB Integration**: Real-time data from The Movie Database API
- **🧪 Testing**: Unit tests with Vitest
- **🎨 Modern UI**: Built with Radix UI and Tailwind CSS
- **📦 Type Safety**: Full TypeScript support

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Context API
- **API**: TMDB (The Movie Database)
- **Testing**: Vitest
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ or Bun
- TMDB API Key (get one at [themoviedb.org](https://www.themoviedb.org/settings/api))

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd movie
```

### 2. Install dependencies

Using npm:
```bash
npm install
```

Using bun:
```bash
bun install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
TMDB_API_KEY=your_api_key_here
```

### 4. Run the development server

```bash
npm run dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
movie/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   └── tmdb/           # TMDB API endpoints
│   ├── movie/[id]/         # Movie detail pages
│   ├── tv/[id]/            # TV show detail pages
│   ├── search/             # Search results page
│   ├── watchlist/          # Watchlist page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/              # React components
│   ├── ui/                 # shadcn/ui components
│   ├── navigation.tsx      # Navigation bar
│   ├── movie-hero.tsx      # Hero section
│   ├── movie-section.tsx   # Movie carousel
│   ├── auth-dialog.tsx     # Authentication dialog
│   └── ...
├── contexts/               # React contexts
│   └── watchlist-context.tsx
├── lib/                    # Utility functions
│   └── tmdb.ts            # TMDB API client
├── __tests__/             # Test files
└── public/                # Static assets
```

## 🧪 Testing

Run tests:
```bash
npm run test
```

Run tests with UI:
```bash
npm run test:ui
```

## 🎨 Features in Detail

### Search Functionality
- Real-time search across movies and TV shows
- Tabbed results view (All, Movies, TV Shows)
- Direct navigation to detail pages

### Watchlist
- Add/remove items from your personal watchlist
- Persisted in localStorage
- Quick access from navigation bar

### Detail Pages
- Full movie/TV show information
- Cast and crew details
- Embedded trailers
- Production information
- User ratings and reviews

### Filtering & Sorting
- Sort by popularity, rating, release date
- Filter by genre, year, rating
- Multiple genre selection

### Authentication
- Simple demo authentication system
- User profile in navigation
- Ready to integrate with real backend

## 🔧 Configuration

### Next.js Config
The `next.config.mjs` includes:
- Image optimization for TMDB images
- TypeScript and ESLint configuration

### Environment Variables
- `TMDB_API_KEY`: Your TMDB API key (required)

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run test:ui` - Run tests with UI

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) for the movie database API
- [shadcn/ui](https://ui.shadcn.com/) for the beautiful UI components
- [Radix UI](https://www.radix-ui.com/) for accessible component primitives
- [Lucide](https://lucide.dev/) for the icon set

## 📧 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using Next.js and React
