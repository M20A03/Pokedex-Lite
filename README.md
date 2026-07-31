# Pokedex Lite

A modern, responsive web application for exploring Pokémon data, built with React and Vite. It consumes the PokéAPI to display detailed Pokémon statistics and uses Firebase for user authentication.

## Features

*   **Comprehensive Database**: Browse through all Pokémon using paginated views.
*   **Search and Filter**: Quickly find Pokémon by name, ID, or elemental type.
*   **Detailed Information**: View comprehensive stats, abilities, flavor text, and physical characteristics.
*   **User Accounts**: Create an account or log in to access personalized features.
*   **Favorites System**: Save and track your favorite Pokémon (requires authentication).
*   **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
*   **Dark Mode**: Sleek dark UI with modern glassmorphism elements.

## Tech Stack

*   **Frontend Framework**: [React 18](https://react.dev/)
*   **Build Tool**: [Vite 5](https://vitejs.dev/)
*   **Styling**: CSS Modules, Vanilla CSS
*   **Authentication & Hosting**: [Firebase v12](https://firebase.google.com/)
*   **Data Source**: [PokéAPI v2](https://pokeapi.co/)

## Getting Started

### Prerequisites

*   Node.js (v18 or higher recommended)
*   npm (Node Package Manager)
*   A Firebase project (for authentication)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/M20A03/Pokedex-Lite.git
    cd Pokedex-Lite
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Firebase:**
    *   Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    *   Enable **Email/Password** authentication in the Firebase Authentication section.
    *   Register a web app in your Firebase project to get your configuration object.
    *   Open `src/firebase/firebaseConfig.js` and replace the placeholder configuration with your project's credentials:

    ```javascript
    const firebaseConfig = {
      apiKey: "YOUR_API_KEY",
      authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
      projectId: "YOUR_PROJECT_ID",
      storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
      messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
      appId: "YOUR_APP_ID",
      measurementId: "YOUR_MEASUREMENT_ID"
    };
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```

5.  **Open in your browser:**
    Navigate to `http://localhost:5173` (or the port provided in the terminal) to view the application.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This will generate a `dist` folder containing the compiled assets, ready to be deployed to any static hosting service (like Firebase Hosting, Netlify, or Vercel).

## Project Structure

```text
src/
├── assets/          # Static assets (images, videos)
├── components/      # Reusable React components (AuthPage, PokemonGrid, etc.)
├── context/         # React Context providers (AuthContext, FavoritesContext)
├── firebase/        # Firebase initialization and configuration
├── hooks/           # Custom React hooks (usePokemon)
├── utils/           # Helper functions and utilities
├── App.jsx          # Main application component
├── main.jsx         # Application entry point
└── index.css        # Global CSS styles and design tokens
```

## License

This project is licensed under the MIT License.
