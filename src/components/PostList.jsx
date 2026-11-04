import { navigateTo } from '@devvit/web/client';

export default function PostList({ posts, favouriteIds, onToggleFavourite }) {
  if (posts.length === 0) {
    return <p>No posts found</p>;
  }

  return (
    <ul>
      {posts.map((post) => {
        const isFavourite = favouriteIds.includes(post.id);

        return (
          <li key={post.id}>
            <h3>{post.title}</h3>
            <p>Score: {post.score}</p>
            {/* permalink that we got from the API response
            leads to the comments page, the post URL may lead to another website */}
            <a
              href={`https://www.reddit.com${post.permalink}`}
              onClick={(event) => {
                event.preventDefault();
                // open the comments page outside the app's frame
                navigateTo(`https://www.reddit.com${post.permalink}`);
              }}
            >
              View post and comments
            </a>{' '}
            <button
              type="button"
              aria-pressed={isFavourite}
              onClick={() => onToggleFavourite(post)}
            >
              {isFavourite ? 'Remove favourite' : 'Add favourite'}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
