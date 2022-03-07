// grep -rl

const search = Deno.args

console.log(`"${search.join('|')}"`)

const browser = Deno.run({
  cmd: [
    'grep',
    '-rlE',
    `--exclude-dir=node_modules`,
    '--exclude-dir=./exam/public',
    '--exclude-dir=dist',
    '--exclude-dir=.yalc',
    search.join('|'),
    '.',
  ],
})

await browser.status()
