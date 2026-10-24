import { useEffect } from 'react';
import { fetchHotPosts } from './api/reddit.js';

export default function App() {
  // request hot posts when this component mounts
  useEffect(() => {
    const controller = new AbortController();

    async function loadHotPosts() {
      try {
        // the API module handles the request and this component inspects the result
        const data = await fetchHotPosts('reactjs', controller.signal);
        console.log('Reddit hot posts:', data);
      } catch (error) {
        // cancelled requests are expected during react's development checks
        if (error.name !== 'AbortError') {
          console.error('Could not fetch Reddit posts:', error);
        }
      }
    }

    loadHotPosts();

    // cancel unfinished work if the component unmounts or the effect restarts
    // later, when the selected subreddit is an effect dependency, switching from
    // r/reactjs to r/javascript can cancel the old subreddit's request before it returns outdated posts
    return () => controller.abort();
  }, []);

  return <h1>Reddit favourites</h1>;
}
