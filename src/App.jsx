import { useState } from 'react';
import PostList from './components/PostList.jsx';
import SubredditForm from './components/SubredditForm.jsx';
import { useFavourites } from './hooks/useFavourites.js';
import { useHotPosts } from './hooks/useHotPosts.js';

export default function App() {
  const [subreddit, setSubreddit] = useState('');
  const { favourites, toggleFavourite } = useFavourites();

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
          {!isLoading && !error && (
            <PostList
              posts={posts}
              favourites={favourites}
              onToggleFavourite={toggleFavourite}
            />
          )}
        </section>
      )}
      <section>
        <h2>Favourites</h2>
        {favourites.length === 0 ? (
          <p>No favourites yet</p>
        ) : (
          <PostList
            posts={favourites}
            favourites={favourites}
            onToggleFavourite={toggleFavourite}
          />
        )}
      </section>
    </main>
  );
}
