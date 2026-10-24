import { useState } from 'react';
import SubredditForm from './components/SubredditForm.jsx';
import { useHotPosts } from './hooks/useHotPosts.js';

export default function App() {
  const [subreddit, setSubreddit] = useState('');

  // connect the form to the hook, which handles requests and cancellation
  useHotPosts(subreddit);

  return (
    <main>
      <h1>Reddit favourites</h1>
      <SubredditForm onSearch={setSubreddit} />
    </main>
  );
}
