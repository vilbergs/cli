import { currentBranch, getConfigParam } from './modules/git.ts'

const branch = await currentBranch()
const repoWithGitExtension = (await getConfigParam('remote.origin.url')).split(
  ':'
)[1]
const repo = repoWithGitExtension.slice(0, repoWithGitExtension.length - 4)

const defaultBranch = await getConfigParam('init.defaultBranch')

if (branch === defaultBranch) {
  console.log(
    `Checked out branch and default branch are the same. Nothing to compare`
  )

  Deno.exit(0)
}

const browser = Deno.run({
  cmd: [
    'open',
    `https://github.com/${repo}/compare/${defaultBranch}...${branch}`,
  ],
})

await browser.status()
