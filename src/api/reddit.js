export async function fetchHotPosts(subreddit, signal) {
  const response = await fetch(
    `https://www.reddit.com/r/${encodeURIComponent(subreddit)}/hot.json?limit=10&raw_json=1`,
    { signal },
  );

  // fetch does not throw automatically for HTTP errors such as 403
  if (!response.ok) {
    throw new Error(`Reddit returned HTTP ${response.status}`);
  }

  // Return the JSON body
  return response.json();
}
