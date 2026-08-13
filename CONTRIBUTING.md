# Contributing to KeyLo

Thanks for contributing to the hackathon project.

## Development workflow

1. Pull the latest `main` branch.
2. Create a focused branch:

   ```bash
   git checkout -b feat/short-description
   ```

3. Work inside `keylo-frontend` unless your task explicitly covers shared documentation or assets.
4. Keep changes focused and avoid committing generated files.
5. Run the checks before opening a pull request:

   ```bash
   cd keylo-frontend
   npm run lint
   npm run build
   ```

6. Open a pull request with a short summary, screenshots for visual changes, and testing notes.

## Code conventions

- Use React components and existing Tailwind utility conventions.
- Keep reusable layout pieces in `src/components`.
- Keep route-level demo content in `src/pages` until a backend data layer is introduced.
- Use accessible labels and meaningful image `alt` text.
- Do not add credentials, API keys, private data, or local configuration to Git.
- Schema changes go in a new `supabase/migrations/<timestamp>_<name>.sql` file with a unique timestamp, applied with `supabase db push` (see README "Supabase setup"). Never edit or delete a migration that has already been pushed — the remote history is fixed.
- Do not introduce a subscription model in product copy or demo flows. The current model is a landlord success fee plus a one-time first-booking tenant fee.

## Commit messages

Use concise imperative messages, for example:

```text
Add Kolkata university rental filters
Fix marketplace product imagery
Update owner revenue model copy
```

## Reporting issues

Include the route, steps to reproduce, expected behavior, actual behavior, browser, and a screenshot or console error when relevant.
