import { navigateTo } from '@devvit/web/client';

export default function PostList({ posts, favouriteIds, onToggleFavourite }) {
  if (posts.length === 0) {
    return <p className="notice">No posts found</p>;
  }

  return (
    <ul className="post-list">
      {posts.map((post) => {
        const isFavourite = favouriteIds.includes(post.id);

        return (
          <li key={post.id}>
            <article>
              <div className="post-meta">
                <span>r/{post.subreddit}</span>
                <p>Score: {post.score}</p>
              </div>
              <h3>{post.title}</h3>
              <div className="post-actions">
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
                </a>
                <button
                  type="button"
                  aria-pressed={isFavourite}
                  onClick={() => onToggleFavourite(post)}
                >
                  {isFavourite ? 'Remove favourite' : 'Add favourite'}
                </button>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
