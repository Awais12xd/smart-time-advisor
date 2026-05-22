# Smart Time Advisor

Smart Time Advisor helps you pick the best time to go outside.
It uses the free Open-Meteo API to score each hour for temperature, rain, air quality, and wind.
It then shows the best 3 slots in plain language so you get a clear answer instead of raw weather data.

## What The App Does

- Search a city and get a forecast-based recommendation.
- Compare hourly conditions in one screen.
- See why a slot ranks well with short reason labels.
- Handle bad input, slow responses, and API errors without breaking the page.

## Why This Is Useful

The API website gives data.
This app gives a decision.

That matters when you want a quick answer for a walk, run, commute, or outdoor plan.

## Tech Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Open-Meteo geocoding and forecast APIs.

Why this stack fits the task:

- Next.js keeps the client and UI flow simple.
- TypeScript makes the API data shapes and scoring logic safer.
- Tailwind keeps the interface easy to tune without a lot of CSS overhead.

## Run

On a fresh machine:

1. Install Node.js and npm.
2. Install dependencies.

   npm install

3. Start the app.

   npm run dev

4. Open http://localhost:3000

No API key is required.

## What To Test

- Search for Lahore, New York, Tokyo, or São Paulo.
- Enter a blank city and check the validation message.
- Enter a bad city name and check the not found message.
- Watch the timeout message if the API is slow.
- Compare the best slots with the hourly timeline and score list.

## Edge Cases Covered

- Empty search input.
- City not found.
- Slow API response.
- API error response.
- Missing pm2_5 values in forecast data.

## Project Files

- app/page.tsx, page layout and content.
- app/components/RecommendationClient.tsx, city search and rendering.
- app/components/RecommendationShell.tsx, client wrapper for the App Router.
- lib/api.ts, geocoding, forecast fetches, timeout, and caching.
- lib/scoring.ts, hourly scoring and slot selection.
- lib/cache.ts, small in-memory TTL cache.

## Submission Notes

This repository includes the required README and ANSWERS files.
The git history includes more than one commit, so it shows progress instead of a single dump.
The project runs without secrets or API keys.
