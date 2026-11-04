import { useEffect, useState } from 'react';
import { fetchPostsByIds } from '../lib/reddit.js';

const STORAGE_KEY = 'favouritePostIds';

function readFavouriteIds() {
  try {
    const ids = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(ids)
      ? [...new Set(ids.filter((id) => typeof id === 'string' && /^[a-z0-9]{1,16}$/.test(id)))]
      : [];
  } catch {
    return [];
  }
}

export function useFavourites() {
  const [favouriteIds, setFavouriteIds] = useState(readFavouriteIds);
  const [favouritePosts, setFavouritePosts] = useState([]);
  const [isLoading, setIsLoading] = useState(favouriteIds.length > 0);
  const [loadError, setLoadError] = useState('');
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    try {
      // store only IDs; titles, scores and links stay in memory
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favouriteIds));
      setStorageError('');
    } catch {
      setStorageError('Could not save favourites. Browser storage is unavailable or full.');
    }
  }, [favouriteIds]);

  useEffect(() => {
    const ids = readFavouriteIds();
    if (ids.length === 0) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadFavourites() {
      try {
        const posts = await fetchPostsByIds(ids, controller.signal);
        if (!controller.signal.aborted) {
          // keep any posts the user added while the request was running
          setFavouritePosts((current) => [
            ...current,
            ...posts.filter((post) => !current.some((saved) => saved.id === post.id)),
          ]);
        }
      } catch (error) {
        if (error.name !== 'AbortError' && !controller.signal.aborted) {
          setLoadError(`Could not load favourites: ${error.message}`);
        }
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadFavourites();
    return () => controller.abort();
  }, []);

  function toggleFavourite(post) {
    setFavouriteIds((ids) => ids.includes(post.id)
      ? ids.filter((id) => id !== post.id)
      : [...ids, post.id]);

    setFavouritePosts((posts) => [...posts.filter((saved) => saved.id !== post.id), post]);
  }

  // IDs control membership so a late response cannot restore a removed favourite
  const favourites = favouriteIds
    .map((id) => favouritePosts.find((post) => post.id === id))
    .filter(Boolean);
  const unavailableCount = !isLoading && !loadError ? favouriteIds.length - favourites.length : 0;

  return {
    favourites,
    favouriteIds,
    toggleFavourite,
    isLoading,
    error: [storageError, loadError].filter(Boolean).join(' '),
    unavailableCount,
  };
}
