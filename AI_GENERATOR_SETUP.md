# AI Lesson Generator Setup

The worksheet/lesson generator now calls a real server function.

## What you need

1. An OpenAI API key.
2. A hosting service that supports serverless functions, such as Netlify or Vercel.

## Important

Do not paste your OpenAI secret key inside `script.js`, `index.html`, or any public file.
It must be saved as a private environment variable named:

`OPENAI_API_KEY`

## Netlify setup

1. Upload/deploy this project to Netlify.
2. Go to Site configuration → Environment variables.
3. Add:
   - Key: `OPENAI_API_KEY`
   - Value: your OpenAI API key
4. Redeploy the site.
5. Test the generator on the homepage.

The Netlify function is here:

`netlify/functions/generate.js`

## Vercel setup

1. Upload/deploy this project to Vercel.
2. Go to Project Settings → Environment Variables.
3. Add:
   - Key: `OPENAI_API_KEY`
   - Value: your OpenAI API key
4. Redeploy the site.
5. Test the generator on the homepage.

The Vercel API route is here:

`api/generate.js`

## What the generator creates

- Complete lesson pack
- Lesson only
- Worksheet only
- Quiz only

The homepage form lets the parent choose grade, subject, topic, learning style, and content type.
