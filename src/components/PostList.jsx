export default function PostList({ posts }) {
  if (posts.length === 0) {
    return <p>No posts found</p>;
  }

  return (
    <ul>
      {posts.map((post) => (
        <li key={post.id}>
          <h3>{post.title}</h3>
          <p>Score: {post.score}</p>
          {/* permalink that we got from the API response
          leads to the comments page, the post URL may lead to another website */}
          <a href={`https://www.reddit.com${post.permalink}`}>View post and comments</a>
        </li>
      ))}
    </ul>
  );
}
