# Reddit favourites

[Open the app on Reddit](https://www.reddit.com/r/a1_awf_dev/comments/1xg0fyi/reddit_favourites/)

Browse a subreddit's 10 hot posts + keep favourites from multiple subreddits. Only post IDs are saved in `localStorage`. Details are fetched again after a refresh.

## setup

Use Node.js 24.18 or later.

```sh
npm ci
npm run login
npm run dev
```

Development runs inside Reddit through Devvit, using the subreddit configured in `devvit.json`.

## deployment

```sh
npm run deploy
```

This uploads the app + installs the latest version in `r/a1_awf_dev`. The community must be public for others to access its app post. Reddit hosts the app after the local command stops.

Saved favourites persist within the same app version. Devvit changes the storage origin when the app version changes.

[references](references.md)
