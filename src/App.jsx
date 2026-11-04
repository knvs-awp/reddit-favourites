import { useState } from 'react';
import PostList from './components/PostList.jsx';
import SubredditForm from './components/SubredditForm.jsx';
import { useFavourites } from './hooks/useFavourites.js';
import { useHotPosts } from './hooks/useHotPosts.js';

export default function App() {
  const [subreddit, setSubreddit] = useState('');
  const {
    favourites,
    favouriteIds,
    toggleFavourite,
    isLoading: favouritesLoading,
    error: favouritesError,
    unavailableCount,
  } = useFavourites();

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
              favouriteIds={favouriteIds}
              onToggleFavourite={toggleFavourite}
            />
          )}
        </section>
      )}
      <section>
        <h2>Favourites</h2>
        {favouritesLoading && <p role="status">Loading favourites...</p>}
        {favouritesError && <p role="alert">{favouritesError}</p>}
        {favouriteIds.length === 0 && <p>No favourites yet</p>}
        {unavailableCount > 0 && <p>Some favourite posts are currently unavailable.</p>}
        {favourites.length > 0 && (
          <PostList
            posts={favourites}
            favouriteIds={favouriteIds}
            onToggleFavourite={toggleFavourite}
          />
        )}
      </section>
    </main>
  );
}
