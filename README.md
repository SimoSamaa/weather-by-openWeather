# Weather App

## Overview
This weather app provides users with real-time weather information for various cities. Users can add cities to their list and view detailed weather information for each city. The app utilizes Vue.js for frontend development, Vuex for state management, Vue Router for navigation, and integrates with the OpenWeather API for weather data. Firebase is used for data storage, and Tailwind CSS is employed for UI styling.

## Features
- **City List Page:** Displays a list of cities added by the user.
- **Weather Details Page:** Provides detailed weather information for a selected city.
- **Add City:** Users can add new cities to their list.
- **Delete City:** Allows users to remove cities from their list.

## Technologies Used
- **Vue.js:** A progressive JavaScript framework for building user interfaces.
- **Vuex:** State management library for Vue.js applications.
- **Vue Router:** Official router for Vue.js, used for navigation.
- **OpenWeather API:** Provides weather data for integration into the app.
- **Firebase:** Real-time database for storing city weather data.
- **Tailwind CSS:** Utility-first CSS framework for quickly building custom designs.

## Screenshots
**large screen**
<div style='display=flex'>
  <img src="https://i.ibb.co/xGKzQcz/Screenshot-2024-03-24-204850.png" alt="App Screenshot" width="400" height="auto">
  <img src="https://i.ibb.co/wrsgDFP/Screenshot-2024-03-24-204942.png" alt="App Screenshot" width="400" height="auto">
  <img src="https://i.ibb.co/S39pgnj/Screenshot-2024-03-24-205839.png" alt="App Screenshot" width="400" height="auto">
  <img src="https://i.ibb.co/61857JZ/Screenshot-2024-03-24-205913.png" alt="App Screenshot" width="400" height="auto">
</div>

**small screen**
<div style='display=flex'>
  <img src="https://i.ibb.co/XsxSY30/Screenshot-2024-03-24-205317.png" alt="App Screenshot" width="200px" height="auto">
  <img src="https://i.ibb.co/hZ2Fb3W/Screenshot-2024-03-24-205423.png" alt="App Screenshot" width="200px" height="auto">
  <img src="https://i.ibb.co/9V2gLRK/Screenshot-2024-03-24-210237.png" alt="App Screenshot" width="200px" height="auto">
</div>

## Configuration
- **Firebase Configuration:** Configure Firebase credentials in `src/main.js`.
- **OpenWeather API:** Set your API key in `src/main.js.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
