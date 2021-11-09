const HOME = Deno.env.get('HOME')

const p = Deno.run({
  cmd: ['bash'],
  stdout: 'piped',
  stdin: 'piped',
})

const encoder = new TextEncoder()
const decoder = new TextDecoder()

const command = `find ~ ~/sites ~/sites/teachiq ~/sites/vilbergs -mindepth 1 -maxdepth 1 | fzf`

await p.stdin.write(encoder.encode(command))

await p.stdin.close()
const output = await p.output()
p.close()

console.log(decoder.decode(output))
