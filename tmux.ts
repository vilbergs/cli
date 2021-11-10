const exec = async (...args: string[]) => {
  console.log(['tmux', ...args].join(' '))

  const tmux = Deno.run({
    cmd: ['tmux', ...args],
    stderr: 'piped',
    stdout: 'piped',
    stdin: 'piped',
  })

  const status = await tmux.status()

  if (status.code > 0) {
    const decoder = new TextDecoder()

    console.error(decoder.decode(await tmux.stderrOutput()))
  }

  tmux.close()

  return status
}

async function hasSession(sessionName: string) {
  const status = await exec('has-session', '-t', sessionName)

  return status.success
}

function createSession() {
  const sessionArgs = ['new-session']

  const methods = {
    name(name: string) {
      sessionArgs.push('-s', name)

      return methods
    },
    directory(name: string) {
      sessionArgs.push('-c', name)

      return methods
    },
    exec: () => exec(...sessionArgs, '-d'),
  }

  return methods
}

function switchClient() {
  const sessionArgs = ['switch-client']

  const methods = {
    target(name: string) {
      sessionArgs.push('-t', name)

      return methods
    },
    directory(name: string) {
      sessionArgs.push('-c', name)

      return methods
    },
    exec: () => exec(...sessionArgs),
  }

  return methods
}

export default {
  hasSession,
  createSession,
  switchClient,
}
