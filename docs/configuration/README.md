# Configuration

Theme-Packer is designed to be extendable. Want to use Vue on your store? You can add it to your config. Want to add a bunch of PostCSS plugins? You can do that too.

We purposely expose most config files in your project root directory, so, if for example you'd like to use TailwindCSS, you can add it via `postcss.config.js` in your project root.

The Webpack config isn't exposed directly to you. The reason for this is that it's a long and complex config. If you wish to change it at all, you can do so with the `'wepack.extend'` config option. For example, if you want to use svgo-loader to optimise your SVGs, you might do the following:

```js
module.exports = {
    'webpack.extend': config => {
        return {
            module: {
                rules: [
                    {
                        test: /\.svg$/,
                        use: [
                            'file-loader',
                            'svgo-loader',
                        ],
                    },
                ],
            },
        };
    },
};
```

Theme-Packer uses [webpack-merge](https://github.com/survivejs/webpack-merge) behind the scenes to merge the config you provide with the pre-existing config. This means that you don't need to completely rewrite the config in order to add whatever plugins/loaders you require.
