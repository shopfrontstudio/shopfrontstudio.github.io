# Shopfront Studio

A small Ballarat studio building websites, running social media, and producing catalogues for local businesses.

Live site: https://shopfrontstudio.github.io

## Stack

- [Astro 5](https://astro.build) — static site generator
- [Tailwind CSS 4](https://tailwindcss.com) — styling
- Hosted on GitHub Pages via Actions

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # output → ./dist
npm run preview    # preview the built site
```

## Deploying

A push to `main` triggers `.github/workflows/deploy.yml`, which builds the site and publishes `./dist` to GitHub Pages.

First-time setup on GitHub:

1. Go to **Settings → Pages** in the repo.
2. Under **Source**, choose **GitHub Actions**.
3. Push to `main`. Watch the Action run in the **Actions** tab.

## Project structure

```
src/
  components/   Header, Footer, Hero, Services, HowItWorks, About, Contact
  layouts/      Layout.astro (shared head + chrome)
  pages/        index.astro
  styles/       global.css (Tailwind + theme tokens)
public/         favicon.svg and other static assets
```

## Contact form

`src/components/Contact.astro` posts to a placeholder Formspree URL. Sign up at [formspree.io](https://formspree.io), create a form, and replace `your-form-id` in the `action` attribute.
