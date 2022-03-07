import { resolve, basename } from 'https://deno.land/std/path/mod.ts'
import tmux from './modules/tmux.ts'

const HOME = Deno.env.get('HOME')
const ROOT_DIR = `${HOME}/sites`

if (!HOME) {
  throw Error('no Home')
}

const dirs = []

for await (const dir of Deno.readDir(ROOT_DIR)) {
  dirs.push(resolve(ROOT_DIR, dir.name))
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

fzf.close()

await goToSession()

async function goToSession() {
  try {
    const hasServer = await tmux.hasServer()
    const hasSession = await tmux.hasSession(sessionName)

    console.log(hasServer, hasSession)

    const createSession = () =>
      tmux
        .createSession()
        .name(sessionName)
        .directory(chosenDir)
        .detached()
        .exec()

    if (!hasServer) {
      await createSession()

      return tmux.attach().target(sessionName).directory(chosenDir).exec()
    }

    if (!hasSession) {
      await createSession()
    }

    return tmux.switchClient().target(sessionName).exec()
  } catch (e) {
    console.error('Error', e)
  }
}
