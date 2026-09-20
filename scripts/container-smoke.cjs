const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  assert.notEqual(process.getuid(), 0, 'runtime must not run as root');
  assert.equal(fs.existsSync('/app/.env'), false);
  assert.equal(fs.existsSync('/app/sanityfruitstation'), false);
  for (const [path, status] of [['/api/health',200], ['/',200], ['/shop',200], ['/product/bananas',200], ['/contact',200], ['/api/stripe',405]]) {
    const response = await fetch('http://127.0.0.1:3000'+path);
    assert.equal(response.status, status, path);
    if(path==='/api/health') assert.deepEqual(await response.json(), {status:'ok'});
    console.log(path+': '+status);
  }
  const page = await (await fetch('http://127.0.0.1:3000/')).text();
  const asset = page.match(/src="([^\"]+\/_next\/static[^\"]+|\/_next\/static[^\"]+)"/);
  assert.ok(asset, 'page must include a static script');
  assert.equal((await fetch('http://127.0.0.1:3000'+asset[1])).status,200);
  console.log('Static asset, non-root user, and excluded files: passed');
})().catch(error => {console.error(error); process.exit(1)});
