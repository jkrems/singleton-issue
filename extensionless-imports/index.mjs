import { deepStrictEqual } from 'assert';

import memoryCache from './store';

import './startup1'; // ESM file
import './startup2'; // CommonJS file

deepStrictEqual(memoryCache, {
	sawStartup1: true,
	sawStartup2: true
});
