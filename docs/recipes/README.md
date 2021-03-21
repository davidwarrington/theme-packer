# Recipe

## Tailwind

### Installing Tailwind css

You can install Tailwind CSS in Theme Packer as a PostCSS plugin via the `postcss.config.js`.

```js
module.exports = ({ mode }) => {
    const plugins = [ require('tailwindcss'), require('autoprefixer') ];

    if (mode === 'production') {
        plugins.push('cssnano');
    }

    return { plugins };
};
```
To configure your Tailwind set up you need to set up `tailwind.config.js` file. You can do this by running:

```bash
npx tailwindcss init
```
This will create a minimal `tailwind.config.js` file, that you can now configure. It is important to make sure you set up your tailwind file to purge any unused css. You will only want to purge Tailwind in production mode, to avoid having to recompile Tailwind often.

```js

module.exports = {
    purge: {
        enabled: process.env.NODE_ENV === 'production',
        content: [
             "**/*.js",
            "**/*.liquid",
            "**/*.vue",
        ],
    },
    theme: {
        extend: {
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
```

