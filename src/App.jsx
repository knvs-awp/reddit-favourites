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
    <main className="app">
      <header className="app-header">
        <h1>Reddit favourites</h1>
        <a href="#favourites">Saved ({favouriteIds.length})</a>
      </header>
      <SubredditForm onSearch={setSubreddit} />
      <div className="content">
        {/* show loading, errors or posts after a subreddit is selected */}
        <section aria-labelledby="hot-posts-title">
          <h2 id="hot-posts-title">{subreddit ? `Hot posts in r/${subreddit}` : 'Hot posts'}</h2>
          {!subreddit && <p className="notice">Enter a subreddit to load posts.</p>}
          {subreddit && isLoading && <p className="notice" role="status">Loading posts...</p>}
          {subreddit && error && <p className="notice" role="alert">{error}</p>}
          {subreddit && !isLoading && !error && (
            <PostList
              posts={posts}
              favouriteIds={favouriteIds}
              onToggleFavourite={toggleFavourite}
            />
          )}
        </section>
        <section id="favourites" aria-labelledby="favourites-title">
          <h2 id="favourites-title">Favourites</h2>
          {favouritesLoading && <p className="notice" role="status">Loading favourites...</p>}
          {favouritesError && <p className="notice" role="alert">{favouritesError}</p>}
          {favouriteIds.length === 0 && <p className="notice">No favourites yet</p>}
          {unavailableCount > 0 && <p className="notice">Some favourite posts are currently unavailable.</p>}
          {favourites.length > 0 && (
            <PostList
              posts={favourites}
              favouriteIds={favouriteIds}
              onToggleFavourite={toggleFavourite}
            />
          )}
        </section>
      </div>
    </main>
  );
}
