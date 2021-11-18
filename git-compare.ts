import { currentBranch, getConfigParam } from './modules/git.ts'

const branch = await currentBranch()
const repoWithGitExtension = (await getConfigParam('remote.origin.url')).split(
  ':'
)[1]
const repo = repoWithGitExtension.slice(0, repoWithGitExtension.length - 4)

const browser = Deno.run({
  cmd: ['open', `https://github.com/${repo}/compare/master...${branch}`],
})

const status = await browser.status()

console.log(status)
