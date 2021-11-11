import { resolve, basename } from 'https://deno.land/std/path/mod.ts'
import tmux from './tmux.ts'

const HOME = Deno.env.get('HOME')

if (!HOME) {
  throw Error('no Home')
}

const dirs = []

for await (const dir of Deno.readDir(`${HOME}/sites`)) {
  dirs.push(resolve(HOME, dir.name))
}

const fzf = Deno.run({
  cmd: ['fzf'],
  stdout: 'piped',
  stdin: 'piped',
})

const encoder = new TextEncoder()
const decoder = new TextDecoder()

await fzf.stdin.write(encoder.encode(dirs.join('\n')))
await fzf.stdin.close()

const chosenDir = decoder.decode(await fzf.output()).trim()
const sessionName = basename(chosenDir).replaceAll('.', '_').trim()

try {
  if (!(await tmux.hasSession(sessionName))) {
    await tmux.createSession().name(sessionName).directory(chosenDir).exec()
  }

  await tmux.switchClient().target(sessionName).exec()
} catch (e) {
  console.error('Error', e)
}
fzf.close()

Deno.exit(0)
