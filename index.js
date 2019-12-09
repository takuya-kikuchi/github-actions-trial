const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");

(async () => {
    try {
        await main();
    } catch (e) {
        core.setFailed(e.message);
    }
})();

async function main() {  
  console.log("Starting action")
  const sourceBranchName = process.env.SOURCE_BRANCH_NAME
  const owner = process.env.REPOSITORY_OWNER_NAME
  const repo = process.env.REPOSITORY_NAME
  const apiKey = process.env.GITHUB_TOKEN
  const mergedPRNumber = process.env.MERGED_PR_NUMBER
  const mergedPRTitle = process.env.MERGED_PR_TITLE

  console.log(`sourceBranchName: ${sourceBranchName}`)
  console.log(`owner: ${owner}`)
  console.log(`repo: ${repo}`)
  console.log(`mergedPRNumber: ${mergedPRNumber}`)
  console.log(`mergedPRTitle: ${mergedPRTitle}`)

  const octokit = new Octokit({ auth: apiKey });
  const pulls = await octokit.pulls.list({ 
        owner: owner,
        repo: repo,
        head: sourceBranchName });
  const pr = pulls.data.shift();
  console.log(`Got pull request: ${pr}`)
  const currentBody = pr.body;

  await octokit.pulls.update({
      owner: owner,
      repo: repo,
      pull_number: pr.number,
      body: currentBody + '\n' + `Merged: PR #${mergedPRNumber}` + ` (${mergedPRTitle})`,
  });

  console.log("done!");
  
}


