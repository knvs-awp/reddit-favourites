import { useState } from 'react';
import PostList from './components/PostList.jsx';
import SubredditForm from './components/SubredditForm.jsx';
import { useHotPosts } from './hooks/useHotPosts.js';

export default function App() {
  const [subreddit, setSubreddit] = useState('');

  // connect the form to the hook, which handles requests and cancellation
  const { posts, isLoading, error } = useHotPosts(subreddit);

  return (
    <main>
      <h1>Reddit favourites</h1>
      <SubredditForm onSearch={setSubreddit} />
      {/* show loading, errors or posts after a subreddit is selected */}
      {subreddit && (
        <section>
          <h2>Hot posts in r/{subreddit}</h2>
          {isLoading && <p role="status">Loading posts...</p>}
          {error && <p role="alert">{error}</p>}
          {!isLoading && !error && <PostList posts={posts} />}
        </section>
      )}
    </main>
  );
}
