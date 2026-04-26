# Modern Weather App

A frontend-only React weather app built with Vite. It uses functional components, hooks, reusable components, a dark/light theme toggle, loading/error states, and the OpenWeather API.

## Folder Structure

```text
modern-weather-app/
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── styles.css
    ├── components/
    │   ├── ErrorMessage.jsx
    │   ├── ForecastList.jsx
    │   ├── LoadingSpinner.jsx
    │   ├── Search.jsx
    │   ├── ThemeToggle.jsx
    │   └── WeatherCard.jsx
    └── services/
        └── weatherApi.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file by copying `.env.example`:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Add your OpenWeather API key to `.env`:

```env
VITE_OPENWEATHER_API_KEY=your_real_api_key_here
```

4. Start the development server:

```bash
npm run dev
```

5. Open the local URL shown in your terminal, usually:

```text
http://localhost:5173
```

## Notes

- This app has no backend.
- The API key is read from `VITE_OPENWEATHER_API_KEY`.
- Vite exposes frontend environment variables to the browser, so do not use sensitive private keys in a public frontend app.
