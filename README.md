# planning-poker-frenzy

Playground to test different frontend frameworks.

- [QwikCity](https://qwik.builder.io/qwikcity/overview/)
- [NextJS 13 with T3](https://github.com/t3-oss/create-t3-app)
- [Remix](https://remix.run/)
- [SvelteKit](https://kit.svelte.dev/)
- [Astro](https://astro.build/)

## Styling

[Tailwind](https://tailwindcss.com/) should be used for most styling.

- [ ] is tailwind a better solution than css-in-js

## Database

The apps should use [Supabase](https://supabase.com/) to store data and have real-time updates on sessions.

- [ ] check if prisma can work with supabase

### Datamodel

<img src="./docs/planning%20model.svg">

- [ ]  should we use nosql model?
- [ ]  define event model?

## UX

- login page
- create session / join session page
- session / vote page
  - create poll
  - vote
  - clear votes
  - show votes
  - finish vote

## Authentication

<https://supabase.com/auth>

- [ ] github ?
- [ ] google ?

## Deployment

Netlify? <https://docs.netlify.com/configure-builds/monorepos/>
