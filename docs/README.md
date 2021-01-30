# Getting Started

Introducing Theme Packer! A modern toolset for developing Shopify themes heavily inspired by the now deprecated [Slate](https://github.com/Shopify/slate).

## Installation

Run the following command:

```bash
yarn create theme-packer-theme ./path/to/theme
# or if you prefer npm
npx create-theme-packer-theme ./path/to/theme
```

## Connecting to your store

Create a `.env` file with the following keys:
```bash
# The store-name.myshopify.com url of your store
SHOPIFY_STORE=

# The ID of theme you wish to develop on/deploy to
SHOPIFY_THEME_ID=

# The API key allowing Themekit to modify your theme
SHOPIFY_PASSWORD=
```

You might also wish to add the following:
```bash
# A file used as ignorelist
SHOPIFY_IGNORES=

# Provide a name for your environment. This will be displayed by ThemeKit
SHOPIFY_ENV=
```

## Start developing

Run Theme Packer in watch mode with:

```bash
yarn watch
# or if you prefer npm
npm run watch
```

## Deploying your store theme

To deploy your theme run:

```bash
yarn deploy
# or if you prefer npm
npm run deploy
```
