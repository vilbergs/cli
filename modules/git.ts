const exec = async (...args: string[]) => {
  const git = Deno.run({
    cmd: ['git', ...args],
    stderr: 'piped',
    stdout: 'piped',
    stdin: 'piped',
  })

  const status = await git.status()

  const textdecoder = new TextDecoder()

  const methods = {
    output: textdecoder.decode(await git.output()).trim(),
    status,
  }

  return methods
}

async function currentBranch() {
  const { output } = await exec('branch', '--show-current')

  return output
}

async function getConfigParam(param: string) {
  const { output } = await exec('config', '--get', param)

  return output
}

export { currentBranch, getConfigParam }
