# R-Jukebox

A modern, real-time YouTube video jukebox web application that allows multiple users to search, queue, and control video playback from any device. Perfect for shared entertainment systems, parties, or remote-controlled media centers.

Read the [behind the scenes case study](https://www.csterk.dev/projects/jukebox) at [ctserk.dev](https://www.csterk.dev/)!

## 📑 Table of Contents

- [R-Jukebox](#r-jukebox)
  - [📑 Table of Contents](#-table-of-contents)
  - [📕 About](#-about)
    - [Key Features](#key-features)
  - [🛠️ Technologies](#️-technologies)
    - [Frontend](#frontend)
    - [Backend Server](#backend-server)
  - [🚀 Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Frontend Setup](#frontend-setup)
    - [Backend Setup](#backend-setup)
  - [📜 Available Scripts](#-available-scripts)
    - [`yarn dev`](#yarn-dev)
    - [`yarn build`](#yarn-build)
    - [`yarn preview`](#yarn-preview)
    - [`yarn theme`](#yarn-theme)
  - [🏗️ Architecture](#️-architecture)
    - [Component Structure](#component-structure)
    - [State Management](#state-management)
    - [Real-time Communication](#real-time-communication)
  - [📁 Project Structure](#-project-structure)
  - [🔧 Configuration](#-configuration)
    - [Server URL](#server-url)
  - [🚀 Deployment](#-deployment)
    - [Raspberry Pi 5 Setup](#raspberry-pi-5-setup)
      - [Prerequisites](#prerequisites-1)
      - [Step 1: Build the Application](#step-1-build-the-application)
      - [Step 2: Transfer Build Files to Raspberry Pi](#step-2-transfer-build-files-to-raspberry-pi)
      - [Step 3: Install and Configure nginx](#step-3-install-and-configure-nginx)
      - [Step 4: Verify Deployment](#step-4-verify-deployment)
      - [Troubleshooting](#troubleshooting)
      - [Updating the Deployment](#updating-the-deployment)
  - [📝 Learn More](#-learn-more)
  - [📄 License](#-license)

---

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

## 🚀 Deployment

### Raspberry Pi 5 Setup

This guide will help you deploy the R-Jukebox client to a Raspberry Pi 5 using nginx as the web server.

#### Prerequisites

* Raspberry Pi 5 with Raspberry Pi OS (previously known as Raspbian) installed
* USB drive or method to transfer files to the Pi
* SSH access to the Pi (recommended)

#### Step 1: Build the Application

On your development machine, build the production version:

```bash
yarn build
```

This creates a `dist/` directory containing all the static files needed for deployment.

#### Step 2: Transfer Build Files to Raspberry Pi

**Recommended approach:** Copy the `dist/` directory to a USB drive, then transfer it to your Raspberry Pi. This is faster and more reliable than cloning the repository and building on the Pi.

1. Copy the `dist/` directory to your USB drive
2. Connect the USB drive to your Raspberry Pi
3. Mount and copy the files to your desired location (e.g., `/var/www/html/r-jukebox`):

```bash
# Mount USB drive (adjust /dev/sda1 to match your USB device)
sudo mount /dev/sda1 /mnt

# Copy the dist directory to your chosen location
# Example: /var/www/html/r-jukebox
sudo cp -r /mnt/dist /var/www/html/r-jukebox

# Unmount USB drive
sudo umount /mnt
```

Alternatively, you can use `scp` to transfer files over the network:

```bash
# From your development machine
scp -r dist/ pi@<raspberry-pi-ip>:/tmp/r-jukebox

# Then on the Pi, move to your desired location
sudo mv /tmp/r-jukebox /var/www/html/r-jukebox
```

**Note:** You can copy the built jukebox to any valid directory path on your Raspberry Pi. Common locations include:
- `/var/www/html/r-jukebox` (standard web server directory)
- `/home/pi/r-jukebox` (user home directory)
- `/desktop/r-jukebox` (custom location)

Just ensure you update the nginx configuration (Step 3) to point to the correct path.

#### Step 3: Install and Configure nginx

1. **Install nginx:**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **Set proper permissions for your build directory:**
   ```bash
   # Adjust the path to match where you copied the build files
   sudo chmod -R 755 /var/www/html
   sudo chown -R www-data:www-data /var/www/html/r-jukebox
   ```
   
   **Note:** If you placed the build files in a different location (e.g., `/desktop/r-jukebox`), update the paths accordingly:
   ```bash
   sudo chmod -R 755 /desktop
   sudo chown -R www-data:www-data /desktop/r-jukebox
   ```

3. **Edit the nginx default site configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/default
   ```

   Update the `root` directive to point to your build directory. **Note:** This can be any valid path where you copied the built jukebox files (e.g., `/var/www/html/r-jukebox`, `/desktop/r-jukebox`, `/home/pi/r-jukebox`):
   ```nginx
   server {
       listen 80 default_server;
       listen [::]:80 default_server;
       
       root /var/www/html/r-jukebox;  # Update this path to match where you copied the build files
       index index.html;
       
       server_name _;
       
       location / {
           try_files $uri $uri/ /index.html;
       }
   }
   ```

4. **Edit the main nginx configuration (if needed):**
   ```bash
   sudo nano /etc/nginx/nginx.conf
   ```

5. **Test nginx configuration:**
   ```bash
   sudo nginx -t
   ```

   If the test passes, you should see:
   ```
   nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
   nginx: configuration file /etc/nginx/nginx.conf test is successful
   ```

6. **Restart nginx:**
   ```bash
   sudo systemctl restart nginx
   ```

7. **Enable nginx to start on boot:**
   ```bash
   sudo systemctl enable nginx
   ```

#### Step 4: Verify Deployment

1. Open a web browser and navigate to your Raspberry Pi's IP address:
   ```
   http://<raspberry-pi-ip>
   ```

2. You should see the R-Jukebox application load.

3. **Monitor nginx access logs (optional):**
   ```bash
   tail -f /var/log/nginx/access.log
   ```

#### Troubleshooting

* **Permission issues:** Ensure the `www-data` user owns the files (adjust path to match your deployment location):
  ```bash
  sudo chown -R www-data:www-data /var/www/html/r-jukebox
  sudo chmod -R 755 /var/www/html/r-jukebox
  ```
  
  If using a different path (e.g., `/desktop/r-jukebox`):
  ```bash
  sudo chown -R www-data:www-data /desktop/r-jukebox
  sudo chmod -R 755 /desktop/r-jukebox
  ```

* **Remove old deployment:**
  ```bash
  # Adjust path to match your deployment location
  sudo rm -rf /var/www/html/r-jukebox
  ```

* **Check nginx status:**
  ```bash
  sudo systemctl status nginx
  ```

* **View nginx error logs:**
  ```bash
  tail -f /var/log/nginx/error.log
  ```

#### Updating the Deployment

When you need to update the client:

1. Build the new version on your development machine: `yarn build`
2. Transfer the new `dist/` directory to the Pi (using the same method as Step 2)
3. Replace the old files (adjust paths to match your deployment location):
   ```bash
   # Example using /var/www/html/r-jukebox
   sudo rm -rf /var/www/html/r-jukebox
   sudo cp -r /path/to/new/dist /var/www/html/r-jukebox
   sudo chown -R www-data:www-data /var/www/html/r-jukebox
   sudo systemctl reload nginx
   ```
   
   If using a different path (e.g., `/desktop/r-jukebox`):
   ```bash
   sudo rm -rf /desktop/r-jukebox
   sudo cp -r /path/to/new/dist /desktop/r-jukebox
   sudo chown -R www-data:www-data /desktop/r-jukebox
   sudo systemctl reload nginx
   ```

---

## 📝 Learn More

* [React Documentation](https://reactjs.org/)
* [Vite Documentation](https://vitejs.dev/)
* [Chakra UI Documentation](https://chakra-ui.com/)
* [Socket.IO Documentation](https://socket.io/docs/v4/)

---

## 📄 License

Private project.
