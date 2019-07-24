// Assumption: 'graphql' would resolve to this.
import { run } from './not-graphql';

import schema from './schema.js';

async function main() {
  await run(schema);
}
main().catch(e => {
  process.nextTick(() => { throw e; });
});
