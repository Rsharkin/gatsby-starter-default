---
title: Dynamic Import named exports in JavaScript
published_at: 2021-02-17
tags: ["javascript", "webpack", "web-dev"]
authors: ["sasivarnan"]
feature_image: ./port.jpg
---

JavaScript has come a long way since its introduction in 1995. The dynamics of the language have completely changed since the adaptation of the `ECMAScript 2015 (ES6)` standard, that got released in 2015.

As many legacy applications started moving to the Web, the web was no longer a place to just serve information. Lots of businesses around the world can run on a web browser. The advent of `ChromeOS` and `Windows 10X` operating systems are proving the same. As a result of such growth, the amount of JavaScript code that we ship to the client has also increased in an exploding way.

To solve this problem of shipping a big bundle of JavaScript, we can take advantage of [dynamic import](https://github.com/tc39/proposal-dynamic-import) (i.e.- lazyload) feature that got introduced in `ECMAScript 2020`. It helps us remove that module from our main bundle by code splitting and download the JavaScript module on demand instead of downloading it at the time of page load.

Let's say we have a module with different exports.

```js
// lib/math.js

export const sum = (a, b) => a + b;

export const sub = (a, b) => a - b;

export const mul = (a, b) => a * b;

export const div = (a, b) => a / b;

export default Math;
```

We can import a JavaScript module dynamically using the `import(<path_to_the_module>)` syntax.

```js
import("./lib/math.js").then((module) => {
  // The resulting module will have every export from the module
  const { default as Math, sum, sub, mul, div } = module;
});
```

But there is one problem here. But default, the entire module is exported including the default and named exports.

What if we want to import only one named export or only default export instead of the entire module dynamically? Let's see a couple of ways on how to pick only the module(s) that we want.

### Webpack Magic Comments

If your current project used `Webpack 5`, then there is a webpack magic comment called `webpackExports` that comes in handy for this situation. We can specify the list of exports to load as an array to this comment and Webpack will take care of bundling only those modules for loading it dynamically.

> **Note:** Using older browsers? Check if your browser supports dynamic import syntax on the [Can I use](https://caniuse.com/es6-module-dynamic-import) database.

Let's see this in action.

```js
// specify webpackExports comments within the import() function

import(/* webpackExports: ["default", "sum"] */ "./lib/math.js").then((module) => {
  // Do something with the module.
  const { default as Math, sum } = module;
});
```

In the above example, we specified a Webpack magic comment called `webpackExports` with the value `["default", "sum"]` to it. While bundling in **production** mode, Webpack will read this info and pick only the specified exports.

Currently [Gatsby](/tag/gatsby) has Webpack 5 support from [version 3.0](https://www.gatsbyjs.com/docs/reference/release-notes/v3.0) and `Create React App` is working the [Webpack 5](https://github.com/facebook/create-react-app/issues/9994) support.

### Re-export as a different module

Don't have `Webpack 5` yet in your project. No worries. There is another hack to get around this.

We just have to create a local module that imports and exports only the exports that we need and dynamically import that module.

Let's create a smaller version of the module by exporting only the required modules from our main module.

```js
// ./lib/mini-math.js;

export { sum, default as default } from "./math";
```

Now let's dynamically import the smaller module.

```js
import("./lib/mini-math.js").then((module) => {
  const { default as Math, sum } = module;
});
```

Now, this bundle will have only the entities that we exported.

---

You can also use these methods to import an named export from `node_modules` folder.

Hope this post helped you to shave off some kilobytes from your JavaScript bundle.

If it helped, let me know in the comments section below and share this post with your circle.

<span>Hero image by <a href="https://unsplash.com/@chuttersnap?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">CHUTTERSNAP</a> on <a href="https://unsplash.com/s/photos/import?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>
