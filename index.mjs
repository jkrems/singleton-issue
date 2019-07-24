// Assumption: 'graphql' would resolve to this.
import { graphql } from 'graphql/index.mjs';

import schema from './schema.js';

async function main() {
  await graphql(schema, 'query { id }');
}
main().catch(e => {
  process.nextTick(() => { throw e; });
});
