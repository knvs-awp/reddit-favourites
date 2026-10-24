import { useState } from 'react';

export function useFavourites() {
  // keep favourites in memory, switching subreddits does not clear this state
  const [favourites, setFavourites] = useState([]);

  function toggleFavourite(post) {
    setFavourites((currentFavourites) => {
      // use the post ID to remove an existing favourite or add a new one
      const isFavourite = currentFavourites.some((favourite) => favourite.id === post.id);

      if (isFavourite) {
        // remove the post from favourites
        return currentFavourites.filter((favourite) => favourite.id !== post.id);
      }

      return [...currentFavourites, post];
    });
  }

  return { favourites, toggleFavourite };
}
