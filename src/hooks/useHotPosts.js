import { useEffect, useState } from 'react';
import { fetchHotPosts } from '../lib/reddit.js';

export function useHotPosts(subreddit) {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // request hot posts when the selected subreddit changes
  useEffect(() => {
    if (!subreddit) return;

    const controller = new AbortController();

    async function loadHotPosts() {
      setIsLoading(true);
      setError('');
      setPosts([]);

      try {
        // the API module handles the request and this hook inspects the result
        const data = await fetchHotPosts(subreddit, controller.signal);

        // the server returns the post fields needed by the list
        if (!controller.signal.aborted) {
          setPosts(data.posts);
        }
      } catch (error) {
        // cancellation is expected when switching subreddits or leaving the component
        if (error.name !== 'AbortError' && !controller.signal.aborted) {
          console.error('Could not fetch Reddit posts:', error);
          setError(`Could not load posts: ${error.message}`);
        }
      } finally {
        // an old request should not change the loading state of a newer request
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    loadHotPosts();

    // cancel unfinished work if the component unmounts or the effect restarts
    // when the selected subreddit is an effect dependency, switching from
    // r/reactjs to r/javascript can cancel the old subreddit's request before it returns outdated posts
    return () => controller.abort();
  }, [subreddit]);

  return { posts, isLoading, error };
}
