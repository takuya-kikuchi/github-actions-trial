const core = require('@actions/core');
const github = require('@actions/github');
const Octokit = require("@octokit/rest");

(async () => {
    try {
        await main();
    } catch (e) {
        // Deal with the fact the chain failed
    }
})();

async function main() {  
    try {
        const sourceBranchName = core.getInput('SOURCE_BRANCH_NAME');
        const owner = core.getInput('REPOSITORY_OWNER_NAME')
        const repo = core.getInput('REPOSITORY_NAME')
        const apiKey = core.getInput('GIT_API_KEY')
        const mergedPRNumber = core.getInput('MERGED_PR_NUMBER')

        const octokit = new Octokit({ auth: apiKey });
        const pulls = await octokit.pulls.list(
            { 
              owner: owner,
              repo: repo,
              head: sourceBranchName
            });
        const pr = pulls.data.shift();
        const currentBody = pr.body;

        await octokit.pulls.update({
            owner: owner,
            repo: repo,
            pull_number: pr.number,
            body: currentBody + '\n' `Merged: #${mergedPRNumber}`,
        });

        console.log("done!");
        
      } catch (error) {
        core.setFailed(error.message);
      }
      
    }


