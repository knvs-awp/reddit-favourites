import { useEffect } from 'react';
import { fetchHotPosts } from '../api/reddit.js';

export function useHotPosts(subreddit) {
  // request hot posts when the selected subreddit changes
  useEffect(() => {
    if (!subreddit) return;

    const controller = new AbortController();

    async function loadHotPosts() {
      try {
        // the API module handles the request and this hook inspects the result
        const data = await fetchHotPosts(subreddit, controller.signal);
        console.log('Reddit hot posts:', data);
      } catch (error) {
        // cancellation is expected when switching subreddits or leaving the component
        if (error.name !== 'AbortError') {
          console.error('Could not fetch Reddit posts:', error);
        }
      }
    }

    loadHotPosts();

    // cancel unfinished work if the component unmounts or the effect restarts
    // when the selected subreddit is an effect dependency, switching from
    // r/reactjs to r/javascript can cancel the old subreddit's request before it returns outdated posts
    return () => controller.abort();
  }, [subreddit]);
}
