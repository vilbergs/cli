// grep -rl

const search = Deno.args

const browser = Deno.run({
  env: {
    LC_ALL: 'C',
  },
  cmd: [
    'grep',
    '-rlE',
    '--exclude-dir=node_modules',
    '--exclude-dir=./exam/public',
    '--exclude-dir=dist',
    '--exclude-dir=.yalc',
    search.join('|'),
    '.',
  ],
})

await browser.status()
