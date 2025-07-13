# Music-Menma

Welcome to **Music-Menma**, a feature-rich and visually stunning music application designed to deliver an immersive and personalized music experience. This app combines user authentication, dynamic playlists, music management, and a sleek UI to bring your favorite music to life.

---

## Project Overview

Music-Menma is a React Native app built with Tamagui for UI, Redux Toolkit for state management, and React Query for API data fetching. It supports user profiles, music playback, playlist management, and integrates with backend APIs for dynamic content and analytics.

---

## Features

- **User Authentication**: Secure sign-up and sign-in flow to personalize your music experience.
- **Music Playback**: Play, pause, skip, and shuffle your music with a sleek and responsive player.
- **Playlist Management**: Create, update, and manage playlists effortlessly.
- **AI-Generated Playlists**: Generate smart playlist suggestions with a visually engaging AI button.
- **Dynamic Music Data**: Fetch your music library, recently played tracks, and top played songs from backend APIs.
- **Logging & Analytics**: Track daily visits and music play logs to enhance user engagement.
- **Responsive UI**: Built with Tamagui for a smooth and adaptive interface across devices.
- **Smooth Animations**: Engaging animations for UI elements like search panel, AI button, and music playback indicators.

---

## Architecture & Technologies

- **React Native** with **Tamagui** for building a performant and beautiful UI.
- **Redux Toolkit** for robust state management of music, playlists, profiles, and audio player.
- **React Query** for efficient data fetching and caching from APIs.
- **Expo Router** for seamless navigation and routing.
- **TypeScript** for type safety and better developer experience.
- **Axios** for API requests.
- **Lottie** for animations.
- **React Native Reanimated** for smooth UI animations.
- **react-audio-pro** for advanced audio playback management.

---

## Folder Structure

### app/
- Main app entry points and routing files.
- Contains subfolders for authentication, music manager, profile, and settings pages.

### Components/
- **Auth/**: SignIn.tsx, SignUp.tsx - User authentication components.
- **HomePage/**: Main.tsx, Aibutton.tsx, PlayList.tsx, page.tsx - Home page UI components including playlist display and AI button.
- **MusicManager/**: AddMusic.tsx, EditMusic.tsx, Manager.tsx - Components for adding, editing, and managing music tracks.
- **MusicPlayer/**: MusicBarCard.tsx, MusicContent.tsx, MusicOverLay.tsx, MusicPlayer.tsx, PlayListMenu.tsx - Music player UI components and overlays.
- **Profile/**: ProfilePage.tsx - User profile page.
- **Setting/**: Setting.tsx - Settings page for user preferences.
- **common/**: Footer.tsx, MusicBar.tsx, NavBar.tsx, PlayListCard.tsx, SearchPanel.tsx, showToast.tsx, TopNotch.tsx, LoadingSpinner.tsx - Shared UI components used across the app.
- **ui/**: LoadingSpinner.tsx - UI utility components.

### redux/
- **slice/**: Redux slices managing music, playlist, profile, and audio player states.
- **store.ts**: Redux store configuration.

### Features/
- Custom hooks and services such as `musicService.ts`, `useAuth.ts`, and hooks for audio duration formatting, storage management, and toast notifications.

### utils/
- **api/**: API utility functions and React Query hooks for fetching music data.
- **endPoints/**: API endpoint constants.
- **constance.ts**: Constant values used throughout the app.

### assets/
- Fonts, icons, images, videos, and Lottie animations used in the app for a rich multimedia experience.

---

## Backend

This app works in conjunction with the backend service available at:  
[Reava-backend](https://github.com/softenrj/Reava-backend)

---

## Getting Started

### Prerequisites

- Node.js and npm installed
- Expo CLI installed globally (`npm install -g expo-cli`)

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd Music-menma
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

4. Use Expo Go app or emulator to run the app on your device.

---

## Development Notes

- The app uses Redux slices to manage different parts of the state: music, playlist, profile, and audio player.
- API calls are centralized in `utils/api` with React Query hooks for caching and state management.
- UI components are modular and reusable, organized by feature and common usage.
- Navigation is handled by Expo Router with file-based routing in the `app/` directory.
- Music playback supports shuffle, next/previous, and logs play events to backend APIs.
- User authentication state is managed with a custom hook `useAuth`.
- Smooth animations and transitions enhance user experience.
- AI playlist generation is integrated with a dedicated AI button component.
- Audio playback is managed using the `react-audio-pro` library for advanced features.

---

## Contribution

Contributions are welcome! Please open issues or submit pull requests to improve the app.

---

## Firebase Configuration

To use Firebase services, you need to create a configuration file with your Firebase project credentials.

1. Create a file named `firebaseConfig.ts` inside the `Configs/` directory at the root of the project.

2. Add the following Firebase initialization code to `Configs/firebaseConfig.ts` (replace the placeholder values with your actual Firebase project credentials):

```typescript
// Import the functions you need from the SDKs you need
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { getReactNativePersistence, initializeAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
```

3. **Important:** Do not commit your Firebase credentials to version control. Keep this file secure and add it to `.gitignore` if necessary.

---

## License

This project is licensed under the MIT License.

---
});

Enjoy your music journey with Music-Menma! 🎶🚀
