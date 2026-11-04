export function fetchHotPosts(subreddit, signal) {
  return fetchAppJson(
    `/api/hot?subreddit=${encodeURIComponent(subreddit)}`,
    signal,
  );
}

export async function fetchPostsByIds(ids, signal) {
  const posts = [];

  // keep each server request small when restoring a longer list
  for (let index = 0; index < ids.length; index += 20) {
    const batch = ids.slice(index, index + 20).join(',');
    const data = await fetchAppJson(`/api/posts?ids=${encodeURIComponent(batch)}`, signal);
    posts.push(...data.posts);
  }

  return posts;
}

async function fetchAppJson(url, signal) {
  const response = await fetch(url, { signal });

  // show the error returned by the Devvit server
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || `Devvit returned HTTP ${response.status}`);
  }

  // return the JSON body
  return response.json();
}
