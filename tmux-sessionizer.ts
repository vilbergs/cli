import { resolve, basename } from 'https://deno.land/std/path/mod.ts'

const HOME = Deno.env.get('HOME')

if (!HOME) {
  throw Error('no Home')
}

const dirs = []

for await (const dir of Deno.readDir(HOME)) {
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

const chosenDir = decoder.decode(await fzf.output())
const sessionName = basename(chosenDir).replaceAll('.', '_').trim()

console.log(sessionName)

const h = await hasSession(sessionName)

console.log(h)

try {
  if (h) {
    await switchSession(sessionName)
  } else {
    await createSession(sessionName, chosenDir)
  }
} catch (e) {
  console.error(e)
}

// const p = Deno.run({
//   cmd: ['tmux', 'switchc -t '],
//   stdout: 'piped',
//   stdin: 'piped',
// })

fzf.close()
Deno.exit()

async function hasSession(sessionName: string) {
  const tmux = Deno.run({
    cmd: ['tmux', 'has-session', '-t', sessionName],
    stderr: 'piped',
  })
  const error = await tmux.stderrOutput()

  tmux.close()

  return error.length === 0
}

async function createSession(sessionName: string, directory: string) {
  const tmux = Deno.run({
    cmd: ['tmux', 'new-session', '-s', sessionName, '-c', directory, '-d'],
    stderr: 'piped',
  })

  const error = decoder.decode(await tmux.stderrOutput())

  if (error.length > 0) {
    throw Error(error)
  }

  tmux.close()
}

async function switchSession(sessionName: string) {
  const tmux = Deno.run({
    cmd: ['tmux', 'switch-client', '-t', sessionName],
    stderr: 'piped',
  })

  const error = decoder.decode(await tmux.stderrOutput())

  if (error.length > 0) {
    throw Error(error)
  }

  tmux.close()
}
