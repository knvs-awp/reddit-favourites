# reddit api notes

the app uses Devvit Web for hosting and its server-side Reddit SDK for API access. direct browser requests returned HTTP 403 (`Failed to fetch`), and Reddit Support declined Data API access.

`/api/hot` loads 10 hot posts using `reddit.getHotPosts()`. `/api/posts` reloads favourites using `reddit.getPostById()`. only favourite IDs are saved in `localStorage`; post details are fetched again after a refresh.

## original JSON endpoint examples

each request gets its own json response. examples below are shortened sample data, with `"..."` for unknown text and a sample numeric score. only hot and by_id are needed for my app.

both responses use reddit's `Listing` format with the same post fields. hot selects posts by their hot ranking; by_id selects the ids I request. the same post can appear in both responses.

api/info note: I tested `/api/info`, but it showed a network-security block in my browser. `/by_id` returned json, so I use it in these examples. the two endpoints are interchangeable for retrieving the saved post details this assignment needs.

## hot posts

```http
GET https://www.reddit.com/r/reactjs/hot.json?limit=10&raw_json=1
```

response: one listing containing up to 10 posts; two sample posts are shown here.

```json
{
  "kind": "Listing",
  "data": {
    "children": [
      {
        "kind": "t3",
        "data": {
          "name": "t3_1xc3owo",
          "title": "sample hot post 1",
          "score": 123,
          "subreddit": "reactjs",
          "permalink": "/r/reactjs/comments/1xc3owo/.../"
        }
      },
      {
        "kind": "t3",
        "data": {
          "name": "t3_...",
          "title": "sample hot post 2",
          "score": 42,
          "subreddit": "reactjs",
          "permalink": "/r/reactjs/comments/.../.../"
        }
      }
    ]
  }
}
```

## posts by id (favourites)

```http
GET https://www.reddit.com/by_id/t3_1xc3owo.json?raw_json=1
```

response: this example requests one id and shows one returned post. by_id also supports multiple saved ids separated by commas in the request path.

```json
{
  "kind": "Listing",
  "data": {
    "children": [{
      "kind": "t3",
      "data": {
        "name": "t3_1xc3owo",
        "title": "...",
        "score": 123,
        "subreddit": "reactjs",
        "permalink": "/r/reactjs/comments/1xc3owo/.../"
      }
    }]
  }
}
```

[references](references.md)
