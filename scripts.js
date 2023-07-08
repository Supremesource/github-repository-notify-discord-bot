const fetch = require('node-fetch');
const Discord = require('discord.js');

const client = new Discord.Client();

let lastCommitSha = null;

async function checkForNewCommits() {
  const response = await fetch('https://api.github.com/repos/:owner/:repo/commits');
  const commits = await response.json();

  if (lastCommitSha === null) {
    // This is the first run of the script, just set the latest commit SHA
    lastCommitSha = commits[0].sha;
  } else if (commits[0].sha !== lastCommitSha) {
    // There is a new commit, notify on Discord
    client.channels.cache.get('your-channel-id')
      .send(`New commit pushed: ${commits[0].html_url}`);

    lastCommitSha = commits[0].sha;
  }
}

client.login('your-discord-bot-token').then(() => {
  // Run the check immediately on start, and then every 5 minutes
  checkForNewCommits();
  setInterval(checkForNewCommits, 5 * 60 * 1000);
});
