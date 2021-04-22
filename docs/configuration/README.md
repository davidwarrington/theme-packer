# Configuration

Theme Packer is designed to be extendable. Want to use Vue on your store? You can add it to your config. Want to add a bunch of PostCSS plugins? You can do that too.

We purposely expose most config files in your project root directory, so, if for example you'd like to use TailwindCSS, you can add it via `postcss.config.js` in your project root.

## Extending webpack

The webpack config isn't exposed directly to you. The reason for this is that it's a long and complex config. If you wish to change it at all, you can do so with the `'webpack.extend'` config option. For example, if you want to use svgo-loader to optimise your SVGs, you might do the following:

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

Theme Packer uses [webpack-merge](https://github.com/survivejs/webpack-merge) behind the scenes to merge the config you provide with the pre-existing config. This means that you don't need to completely rewrite the config in order to add the plugins or loaders you require.

## Overriding webpack

::: warning
It is recommended that you avoid overriding the built-in config if possible. It should only be overwritten if you are confident with webpack configuration.
:::

Unfortunately sometimes we need to make deeper customisations than webpack-merge will allow. You can use the `'webpack.override'` config option for this instead. It is treated as two curried functions. The first of which will receive the Theme Packer config as a parameter and the second of which will receive the base webpack config as a parameter. In the example below, it is used to override the default `svg` rule, treating SVG imports ending in `?source` as a different type of [asset module](https://webpack.js.org/guides/asset-modules/).


```js
module.exports = {
    'webpack.override': config => webpackConfig => {
        const newConfig = { ...webpackConfig };

        newConfig.module.rules = newConfig.module.rules.map(rule => {
            if (rule.test.test('.svg')) {
                rule.oneOf = [
                    {
                        resourceQuery: /source/,
                        type: 'asset/source',
                    },
                    {
                        generator: rule.generator,
                        type: rule.type,
                    },
                ];

                delete rule.generator;
                delete rule.type;
            }

            return rule;
        });

        return newConfig;
    },
};
