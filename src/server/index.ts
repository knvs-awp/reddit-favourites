import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { createServer, getServerPort, reddit } from '@devvit/web/server';

const app = new Hono();

function toPostData(post) {
  return {
    id: post.id.replace(/^t3_/, ''),
    title: post.title,
    score: post.score,
    subreddit: post.subredditName,
    permalink: post.permalink,
  };
}

app.get('/api/hot', async (c) => {
  const subreddit = (c.req.query('subreddit') || '').trim().replace(/^r\//i, '');

  if (!/^[a-zA-Z0-9_]{1,21}$/.test(subreddit)) {
    return c.json({ error: 'Enter a valid subreddit name, such as reactjs.' }, 400);
  }

  try {
    const posts = await reddit.getHotPosts({ subredditName: subreddit, limit: 10 }).all();

    // return only the post fields used by React
    return c.json({ posts: posts.map(toPostData) });
  } catch (error) {
    console.error(`Could not load hot posts from r/${subreddit}:`, error);
    return c.json({ error: `Reddit could not load r/${subreddit}. It may be unavailable or private.` }, 502);
  }
});

app.get('/api/posts', async (c) => {
  const ids = (c.req.query('ids') || '').split(',');

  if (ids.length > 20 || ids.some((id) => !/^[a-z0-9]{1,16}$/.test(id))) {
    return c.json({ error: 'Provide between 1 and 20 valid post IDs.' }, 400);
  }

  const uniqueIds = [...new Set(ids)];
  const results = await Promise.allSettled(
    uniqueIds.map((id) => reddit.getPostById(`t3_${id}`)),
  );

  // missing or inaccessible posts should not hide the other favourites
  const failure = results.find((result, index) =>
    result.status === 'rejected' &&
    result.reason?.code !== 5 &&
    result.reason?.code !== 7 &&
    result.reason?.message !== `no post t3_${uniqueIds[index]}`,
  );

  if (failure?.status === 'rejected') {
    console.error('Could not reload favourites:', failure.reason);
    return c.json({ error: 'Could not reload favourites from Reddit. Please try again later.' }, 502);
  }

  const posts = results
    .filter((result) => result.status === 'fulfilled')
    .map((result) => toPostData(result.value));
  return c.json({ posts });
});

function createPost() {
  return reddit.submitCustomPost({ title: 'Reddit favourites', entry: 'default' });
}

app.post('/internal/menu/create-post', async (c) => {
  try {
    const post = await createPost();
    return c.json({ navigateTo: `https://www.reddit.com/comments/${post.id.replace(/^t3_/, '')}` });
  } catch (error) {
    console.error('Could not create the app post:', error);
    return c.json({ showToast: 'Could not create the Reddit favourites post.' }, 500);
  }
});

app.post('/internal/triggers/on-app-install', async (c) => {
  try {
    await createPost();
    return c.json({ status: 'success', message: 'Reddit favourites post created.' });
  } catch (error) {
    console.error('Could not create the app post on install:', error);
    return c.json({ status: 'error', message: 'Could not create the app post.' }, 500);
  }
});

// start the server with the Reddit request context supplied by Devvit
serve({
  fetch: app.fetch,
  createServer,
  port: getServerPort(),
});
