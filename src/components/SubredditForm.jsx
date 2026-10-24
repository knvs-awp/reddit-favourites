import { useState } from 'react';

export default function SubredditForm({ onSearch }) {
  const [subreddit, setSubreddit] = useState('');

  function handleSubmit(event) {
    event.preventDefault();

    // accept a name with or without r/, then pass it to the parent
    const name = subreddit.trim().replace(/^r\//i, '');
    onSearch(name);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="subreddit">Subreddit </label>
      <input
        id="subreddit"
        name="subreddit"
        value={subreddit}
        onChange={(event) => setSubreddit(event.target.value)}
        placeholder="reactjs"
        pattern="([rR]/)?[a-zA-Z0-9_]+"
        title="Enter a subreddit name such as reactjs or r/reactjs"
        required
      />{' '}
      <button type="submit">Load posts</button>
    </form>
  );
}
