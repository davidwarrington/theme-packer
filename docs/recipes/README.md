# Recipe

## Tailwind

### Installing Tailwind css

To use Tailwind CSS with Theme packer you first need to install Tailwind via the command line like so:
```bash
npm i tailwindcss
```
Make sure to update your `theme.scss` file to `theme.css` in your styles folder. You will also need to update the `theme.js` import statement from `import '../../styles/theme.scss'` to `import '../../styles/theme.css`.

We include Tailwind css in the new `theme.css` file you have created like so:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Add Tailwind as PostCSS plugin

You can then add Tailwind CSS in Theme Packer as a PostCSS plugin via the `postcss.config.js`.

```js
module.exports = ({ mode }) => {
    const plugins = [ require('tailwindcss'), require('autoprefixer') ];

    if (mode === 'production') {
        plugins.push('cssnano');
    }

    return { plugins };
};
```

### Configure Tailwind

To configure your Tailwind set up you need to set up `tailwind.config.js` file. You can do this by running:

```bash
npx tailwindcss init
```
This will create a minimal `tailwind.config.js` file, that you can now configure. It is important to make sure you set up your tailwind file to purge any unused css. List any files in your project that reference tailwind classes, for an optimal production build. 


```js

module.exports = {
    purge: {
        content: [
            '**/*.js',
            '**/*.liquid',
            '**/*.vue',
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

