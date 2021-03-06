import { currentBranch, getConfigParam } from './modules/git.ts'

const [compareBranch] = Deno.args

const branch = await currentBranch()
const repoWithGitExtension = (await getConfigParam('remote.origin.url')).split(
  ':'
)[1]
const repo = repoWithGitExtension.slice(0, repoWithGitExtension.length - 4)

if (!compareBranch) {
  console.error(
    'You must define a branch to compare with: Ex. "git-compare master"'
  )

  Deno.exit(1)
}

if (branch === compareBranch) {
  console.log(
    `Checked out branch and default branch are the same. Nothing to compare`
  )

  Deno.exit(0)
}

const browser = Deno.run({
  cmd: [
    'open',
    `https://github.com/${repo}/compare/${compareBranch}..${branch}`,
  ],
})

await browser.status()
