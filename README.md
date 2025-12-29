# R-Jukebox

A modern, real-time YouTube video jukebox web application that allows multiple users to search, queue, and control video playback from any device. Perfect for shared entertainment systems, parties, or remote-controlled media centers.

## 📕 About

R-Jukebox is a collaborative video playback system consisting of a React frontend and a Node.js backend server. The frontend provides an intuitive interface for searching YouTube videos, managing queue state, and controlling playback, while the backend server handles actual video playback and maintains synchronized state across all connected clients.

### Key Features

- 🎵 **Real-time Video Playback Control** - Play, pause, seek, and control volume
- 📋 **Queue Management** - Add videos to queue, reorder, and manage upcoming tracks
- 🔍 **YouTube Search** - Search with autocomplete suggestions and infinite scroll
- 📜 **Playback History** - View and replay previously played videos with search and filtering
- 🔄 **Multi-Client Synchronization** - All connected devices stay in sync via WebSockets
- 📱 **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- 🎨 **Theming** - Dark/light mode with seasonal themes (Halloween, Christmas)
- ⚡ **Optimistic UI** - Smooth interactions with instant feedback

---

## 🛠️ Technologies

### Frontend

* **[React 18](https://react.dev/)** - UI framework
* **[TypeScript](https://www.typescriptlang.org/)** - Type safety
* **[Vite](https://vitejs.dev/)** - Build tool and dev server
* **[Chakra UI v3](https://chakra-ui.com/)** - Component library and styling
* **[Socket.io Client](https://socket.io/docs/v4/client-api/)** - Real-time communication
* **[SWR](https://swr.vercel.app/)** - Data fetching and caching
* **[Emotion](https://emotion.sh/docs/introduction)** - CSS-in-JS styling
* **[Axios](https://axios-http.com/)** - HTTP client

### Backend Server

The backend server is a [separate repository](https://github.com/csterk-dev/R-Jukebox-API) that handles video playback and state management:

* **[Socket.IO](https://socket.io/docs/v4/)** - Real-time bidirectional communication
* **[Puppeteer](https://pptr.dev/)** - Browser automation for video playback
* **[SQLite3](https://github.com/TryGhost/node-sqlite3)** - Database for storing playback history
* **[Express.js](https://expressjs.com/)** - Web server framework
* **[Express Async Handler](https://github.com/Abazhenov/express-async-handler)** - Async error handling
* **[Axios](https://axios-http.com/)** - HTTP client for YouTube API

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v24 or higher)
* Yarn package manager
* Backend server running (see [Backend Setup](#backend-setup))

### Frontend Setup

1. **Install dependencies:**
   ```bash
   yarn install
   ```

2. **Start development server:**
   ```bash
   yarn dev
   ```
   The app will be available at `http://localhost:5174` (Vite default local dev server address)

3. **Build for production:**
   ```bash
   yarn build
   ```

4. **Preview production build:**
   ```bash
   yarn preview
   ```

### Backend Setup

The backend server must be running for the frontend to function. Refer to the backend repository for setup instructions.

**Backend Server Commands:**
* `yarn build` - Compile TypeScript code into the `build/` directory
* `yarn start` - Start the Node.js server
* `yarn dev` - Simultaneously build and start the server

The frontend automatically connects to the backend server:
* **Development**: `http://localhost:3001`
* **Production**: Uses the same host as the frontend on port 3001

---

## 📜 Available Scripts

### `yarn dev`
Runs the app in development mode with Vite. The page will reload automatically when you make edits.

### `yarn build`
Builds the app for production. TypeScript is compiled and the app is bundled and optimized for best performance. Output is placed in the `dist/` folder.

### `yarn preview`
Previews the production build locally. Useful for testing the optimized build before deployment.

### `yarn theme`
Generates TypeScript types for Chakra UI theme configuration. Run this when you modify theme tokens.

---

## 🏗️ Architecture

### Component Structure

The project follows atomic design principles:

* **Atoms** - Basic UI components (`CurrentVideo`, `VideoCard`, `PageBackdrop`)
* **Molecules** - Composite components (`Header`, `SearchModal`, `QueueHistoryTabs`)
* **Templates** - Page layouts (`PageContainer`)
* **Organisms** - Complex feature components

### State Management

* **AppContext** - Global app state (theme, mobile detection, background animation)
* **PlayerContext** - Video player state (current video, queue, playback controls)
* **SWR Hooks** - Server state management for YouTube search and history

### Real-time Communication

The app uses Socket.IO to maintain real-time synchronization with the backend:
- Automatic reconnection on disconnect
- State synchronization on connect/reconnect
- Multi-client support with broadcast updates

---

## 📁 Project Structure

```
src/
├── components/          # React components (atoms, molecules, templates)
├── constants/           # App constants and configuration
├── state/              # Context providers and state management
├── theme/              # Chakra UI theme configuration
├── types/              # TypeScript type definitions
├── utils/              # Utility functions and helpers
├── App.tsx             # Root component
└── main.tsx            # Application entry point
```

---

## 🔧 Configuration

### Server URL

The server URL is automatically configured based on the environment:
- **Development**: `http://localhost:3001`
- **Production**: Uses the same host as the frontend on port 3001

Configuration can be found in `src/constants/index.ts`.

---

## 📝 Learn More

* [React Documentation](https://reactjs.org/)
* [Vite Documentation](https://vitejs.dev/)
* [Chakra UI Documentation](https://chakra-ui.com/)
* [Socket.IO Documentation](https://socket.io/docs/v4/)

---

## 📄 License

Private project.
