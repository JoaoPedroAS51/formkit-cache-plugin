# formkit-cache-plugin

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![bundle][bundle-src]][bundle-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]
[![JSDocs][jsdocs-src]][jsdocs-href]

Using the createStoragePlugin function, you can easily save unsubmitted user form inputs to any driver from [unstorage](https://unstorage.unjs.io/) which will be restored on page load. This is great for preventing data loss in the event a user's browser crashes, tab is closed, or other unforeseen issue causes your application to reload before the user can submit their data.

> The difference between this plugin and the official [LocalStorage Plugin](https://formkit.com/plugins/local-storage) is that this plugin allows you to use any driver from [unstorage](https://unstorage.unjs.io/) instead of just localStorage.

See [Official LocalStorage Plugin](https://formkit.com/plugins/local-storage) documentation.

## Installation

Install package:

```sh
# npm
npm install formkit-cache-plugin

# yarn
yarn add formkit-cache-plugin

# pnpm
pnpm install formkit-cache-plugin
```

Add it to our FormKit config as a plugin.

The `createStoragePlugin` has options you can configure:

- `driver` - The driver from [unstorage](https://unstorage.unjs.io/) to use for saving and loading data. Defaults to [Memory](https://unstorage.unjs.io/drivers/memory).
- `prefix` - The prefix assigned to your storage key. Defaults to formkit.
- `key` - An optional key to include in the storage key name, useful for keying data to a particular user.
- `control` - An optional field name for a field in your form you would like to use to enable saving to storage when true. The field value must be a boolean.
- `maxAge` - The time (in milliseconds) that the saved storage should be considered valid. Defaults to 1 hour.
- `debounce` - The debounce to apply to saving data to storage. Defaults to 200ms
- `beforeSave`: — An optional async callback that recieves the form data. Allows modification of form data before saving to storage.
- `beforeLoad`: — An optional async callback that recives the form data. Allows modification of the storage data before applying to the form.

> If you want to save in localStorage, you must set the `driver` to `localStorageDriver()`.

```js
import { defaultConfig } from '@formkit/vue'
import { createCachePlugin } from "formkit-cache-plugin";

// Formkit config
const config = defaultConfig({
  plugins: [
    createCachePlugin({
      // plugin defaults:
      driver: memoryDriver(),
      prefix: 'formkit',
      key: undefined,
      control: undefined,
      maxAge: 3600000, // 1 hour
      debounce: 200,
      beforeSave: undefined,
      beforeLoad: undefined
    })
  ]
})

export default config
```

## Usage
To enable saving to storage add the `cache` to your FormKit form. The storage key will be your provided prefix (default is formkit) and your form name eg. formkit-contact.

### Basic example
```vue
<template>
  <FormKit type="form" name="contact" cache @submit="submitHandler">
    <FormKit type="text" name="name" label="Your name" />
    <FormKit type="text" name="email" label="Your email" />
    <FormKit type="textarea" name="message" label="Your message" />
  </FormKit>
</template>
```

That's it! Your form data will now be saved on every commit event that the form receives. It will remain valid until the maxAge set in your plugin config, and the storage data is cleared when the submit event fires on the target form.

For more examples, see the [Official LocalStorage Plugin](https://formkit.com/plugins/local-storage) documentation.

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## License

Made with 💛

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/formkit-cache-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/formkit-cache-plugin
[npm-downloads-src]: https://img.shields.io/npm/dm/formkit-cache-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/formkit-cache-plugin
[codecov-src]: https://img.shields.io/codecov/c/gh/unjs/formkit-cache-plugin/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/unjs/formkit-cache-plugin
[bundle-src]: https://img.shields.io/bundlephobia/minzip/formkit-cache-plugin?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=formkit-cache-plugin
[license-src]: https://img.shields.io/github/license/unjs/formkit-cache-plugin.svg?style=flat&colorA=18181B&colorB=F0DB4F
[license-href]: https://github.com/unjs/formkit-cache-plugin/blob/main/LICENSE
[jsdocs-src]: https://img.shields.io/badge/jsDocs.io-reference-18181B?style=flat&colorA=18181B&colorB=F0DB4F
[jsdocs-href]: https://www.jsdocs.io/package/formkit-cache-plugin
