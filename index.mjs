import { run } from 'x-core';

import x from 'x-provider';

async function main() {
  await run(x);
}
main().catch(e => {
  process.nextTick(() => { throw e; });
});
