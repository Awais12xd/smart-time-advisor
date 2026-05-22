# Smart Time Advisor

Smart Time Advisor uses the free Open-Meteo API to rank the best time to go outside.
You enter a city, and the app scores each hour for temperature, rain, air quality, and wind.
It shows the best 3 slots in plain language.

## Run

1. Install dependencies.

	npm install

2. Start the app.

	npm run dev

3. Open http://localhost:3000

## What you need

You need Node.js and npm.
No API key is required.

## What the app handles

The app handles slow API responses with a timeout.
The app handles API errors with friendly messages.
The app handles bad city input with clear validation.

## Tech

Next.js, TypeScript, and Tailwind CSS.
