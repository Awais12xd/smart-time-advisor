# ANSWERS

1. How to run

On a fresh machine, install Node.js and npm.

Run:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

No API key is required.

2. Stack choice

I picked Next.js, TypeScript, and Tailwind CSS.
Next.js gives one app for the UI and the data flow.
TypeScript keeps the Open-Meteo response shape clear.
Tailwind keeps layout work fast and keeps styles close to the component tree.

A worse choice would be a plain HTML and JavaScript setup with no build tool.
The state, API fetches, and hourly rendering would get harder to manage.
A backend-heavy stack would add setup without helping this task.

3. One real edge case

Open-Meteo sometimes omits pm2_5 in forecast data.
In [lib/scoring.ts](lib/scoring.ts#L25-L30), missing pm2_5 gets a neutral air quality score of 50.
In [lib/api.ts](lib/api.ts#L69-L76), the forecast mapper stores missing pm2_5 values as null.

Without this handling, the app would treat missing air quality data as broken input.
That would lead to unstable scores or weak output for some locations.

4. AI usage

I used GitHub Copilot in VS Code during this work.
I asked for project scaffolding, Open-Meteo API wiring, caching, timeout handling, scoring logic, client search flow, hero polish, and the assessment docs.
It returned the Next.js structure, helper functions, UI drafts, and doc drafts.

I changed part of the first UI output.
I moved the search form into the hero and removed the empty placeholder boxes.
The first draft felt too empty and did not give the page enough structure.

5. Honest gap

The city lookup still picks the first geocode match.
That is weak for shared city names and places with close results.

With one more day, I would add a result picker with country and region labels.
I would then use the selected place for the forecast request.