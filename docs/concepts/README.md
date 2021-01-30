# Concepts

## Entrypoints

Theme Packer uses files within the `layout` and `templates` subdirectories of `/src/scripts` as entrypoints for your JavaScript. This allows you to split your JS into separate modules depending on where it is used. Have a custom product builder that only runs on your `product.builder.liquid` template? Create `/src/scripts/templates/product.builder.js` and set your script up there. This means that users who only visit the homepage won't have to download that script to visit your site.

Behind the scenes Theme Packer generates `base.script-tags.liquid` and `base.style-tags.liquid` snippets so that you don't have to worry about adding `script` and `link` tags for these files manually.

::: tip
If you need to debug a problem and think the above snippets might be the cause, either run `build` or `watch`, and open these snippets inside `/dist/snippets` to see what's being rendered.
:::

## Code Splitting

It's almost unavoidable that as your project develops, one or two dependencies will be shared across multiple entrypoints. For example, you might be using React on your `collection.js` and `product.js` entrypoints, or you might be using Axios on multiple pages to fetch data from APIs. In these cases, Theme Packer will split those dependencies into shared bundles so that you're not sending duplicate code to your users.

These shared bundles combine the names of their original entrypoints. For example a bundle containing code for `collection.js` and `product.js` might become `templates.collection@templates.product.js`. This makes it easier for us to generate the Liquid templates required to add those entrypoints to the page.

::: warning
If code is shared across too many entrypoints the generated filename may be too long to upload to Shopify. Currently the only workaround for this is to edit your webpack config with `'webpack.extend'` and edit the [optimization options](https://webpack.js.org/configuration/optimization/).
:::
