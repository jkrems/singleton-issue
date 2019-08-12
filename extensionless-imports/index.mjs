import { deepStrictEqual } from 'assert';

import plugins from './plugins';

import './register-plugin-a'; // ESM file
import './register-plugin-b'; // CommonJS file

deepStrictEqual(plugins, {
	pluginA: true,
	pluginB: true
});
