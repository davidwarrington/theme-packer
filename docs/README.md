# Getting Started

Introducing Theme Packer! A modern toolset for developing Shopify themes heavily inspired by the now deprecated [Slate](https://github.com/Shopify/slate).

## Installation

Run the following command:

<code-group>
<code-block title="YARN">
```bash
yarn create theme-packer-theme ./path/to/theme
```
</code-block>

<code-block title="NPM">
```bash
npx create-theme-packer-theme ./path/to/theme
```
</code-block>
</code-group>

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

<code-group>
<code-block title="YARN">
```bash
yarn watch
```
</code-block>

<code-block title="NPM">
```bash
npm run watch
```
</code-block>
</code-group>

## Deploying your store theme

To deploy your theme run:

<code-group>
<code-block title="YARN">
```bash
yarn deploy
```
</code-block>

<code-block title="NPM">
```bash
npm run deploy
```
</code-block>
</code-group>
