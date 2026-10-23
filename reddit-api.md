# reddit api notes

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

## references

- [hot endpoint](https://www.reddit.com/dev/api/#GET_hot), [post lookup](https://www.reddit.com/dev/api/#GET_api_info), and [post listing by id](https://www.reddit.com/dev/api/#GET_by_id_names)
