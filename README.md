# Divergent Specifier Hazard

This repo contains examples of the hazard posed when a _specifier_ (such as the strings in `import 'pkg'` or `require('./file')`) is resolved to different files in Node.js CommonJS and ES module environments. We’re calling this phenomenon a _divergent_ specifier. For example:

- `import 'pkg'` resolves to `node_modules/pkg/src/index.mjs` while `require('pkg')` resolves to `node_modules/pkg/dist/index.js`; or
- `import './file'` resolves to `./file.mjs` while `require('./file')` resolves to `./file.js`.

This leads to issues when a codebase is a mix of CommonJS and ES module files. Even if the user’s app is entirely ES module files, if any dependencies are CommonJS the hazard is still present.

## See for yourself

1. Make sure you’re running Node.js 12 or later (but < whatever version `--experimental-modules` is unflagged; as of this writing Node 12.0.0 through 12.8.0).
1. Clone this repo.
1. Navigate to each subfolder in this repo and run `npm test`.

## Explanation

The hazard is that the `pkg` created by `import pkg from 'pkg'` is not the same as the `pkg` created by `const pkg = require('pkg')`. An `instanceof` comparison of the two returns `false`, and properties added to one (like `pkg.foo = 3`) are not present on the other. This differs from how `import` and `require` statements work in all-ES module or all-CommonJS environments, respectively, and therefore is surprising to users.

Essentially, the `pkg` in each environment is a separate _singleton._ Whereas in one ES module file you can have `import a from 'pkg'` and in another you can write `import b from 'pkg'` and `a instanceof b` returns `true`, that would not be the case for `const b = require('pkg')`.

The ES module syntax that users have been writing for use in Node.js via Babel or [`esm`](https://github.com/standard-things/esm#readme) for the last several years does not behave this way, because Babel or `esm` have been transpiling everything into CommonJS before evaluation. In the previous example, `import a from 'pkg'` would be converted to `const a = require('pkg')` and then `a instanceof b` (where `b` comes from `const b = require('pkg')`) would return `true`.

If you look at it another way, `import pkg from 'pkg'` is a shorthand for `import pkg from './node_modules/pkg/src/index.mjs'` and `const pkg = require('pkg')` is a shorthand for `const pkg = require('./node_modules/pkg/dist/index.js')`. Because the file paths in the two statements are different, the two `pkg` singletons are different.

The same applies to files as it does to packages: in `--es-module-specifier-resolution=node`, a.k.a. the “automatic extension resolution” mode familiar to users from CommonJS, `import foo from './file'` is really a shorthand for `import foo from './file.mjs'` while `const foo = require('./file')` is a shorthand for `const foo = require('./file.js')`. Because they’re different file paths, the `foo`s are different. This mode was the default in the Node.js 7 through 11 `--experimental-modules` implementation, but it was put behind the `--es-module-specifier-resolution=node` flag in Node.js 12. (The default in Node.js 12 is `--es-module-specifier-resolution=explicit`, where file extensions are required.)

Because the default mode in Node.js 12 is to require explicit file extensions in ES module code (so `'./file.mjs'`, not `'./file'`) and because there is no way for a package main entry point to map to different files in CommonJS versus ES modules (`"main"` must point to exactly one file and applies to both CommonJS and ES module environments), this hazard is not currently present in Node.js 12 except under `--es-module-specifier-resolution=node`. That’s what you see in this repo. If the `--es-module-specifier-resolution=node` behavior were to become the default, the hazard would be present at all times for all users, rather than opted into via the flag.

## In the real world

This came up with the `graphql` package under the Node.js 7-11 `--experimental-modules` implementation. You can see discussion of it [here](https://github.com/graphql/graphql-js/issues/1479#issuecomment-416718578).
