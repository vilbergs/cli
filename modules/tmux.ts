const exec = async (...args: string[]) => {
  console.log(['tmux', ...args].join(' '))

  const tmux = Deno.run({
    cmd: ['tmux', ...args],
    stderr: 'piped',
    stdout: 'piped',
    stdin: 'piped',
  })

  const status = await tmux.status()

  return status
}

async function hasServer() {
  const status = await exec('info')

  return status.success
}

async function hasSession(sessionName: string) {
  const status = await exec('has-session', '-t', sessionName)

  return status.success
}

function attach() {
  const sessionArgs = ['attach']

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

function createSession() {
  const sessionArgs = ['new-session']

  const methods = {
    name(name: string) {
      sessionArgs.push('-s', name)

      return methods
    },
    directory(name: string) {
      sessionArgs.push('-c', name)

      console.log(name)
      return methods
    },
    detached() {
      sessionArgs.push('-d')

      return methods
    },
    exec: () => exec(...sessionArgs),
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
    exec: () => exec(...sessionArgs),
  }

  return methods
}

export default {
  hasServer,
  hasSession,
  attach,
  createSession,
  switchClient,
  exec,
}
