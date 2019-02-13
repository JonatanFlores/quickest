# Quickest

Quickest is a NodeJS framework for development of Restful APIs, the idea behind it is to be very simple and lightweight.

## How to install it

First create the folder where your application will live and then inside of it require the framework through the following command:

```
$ npm i -S quickest
```

## How to Use It

Setting up the framework

```
const Quickest = require("quickest");
const app = new Quickest();
const port = process.env.PORT || 3001;
```

POST Route: http://localhost:3001/posts

```
app.post("/posts", (req, res) => {
  res.status(201).send("Create post");
});
```

PUT Route: http://localhost:3001/posts/12

```
app.put("/posts/:id", (req, res) => {
  return res.send(`Edit post: ${req.params.id}`);
});
```

GET Route: http://localhost:3001/posts

```
app.get("/posts", (req, res) => {
  return res.send("Get all posts");
});
```

GET Route: http://localhost:3001/posts/123

```
app.get("/posts/:id", (req, res) => {
  return res.send("Get post by id");
});
```

GET Route: http://localhost:3001/posts/123/my-test-slug

```
app.get("/posts/:id/:slug", (req, res) => {
  return res.send("Get post by id and slug");
});
```

GROUP Route: http://localhost:3001/api/posts

```
app.group("/api", () => {
  app.get("/posts", (req, res) => {
    return res.send("API: Get all posts");
  });
});
```

NOT FOUND Route:

```
app.notFound((req, res) => {
  return res.status(404).send("404 Not Found");
});
```

Listen for incoming requests on the server

```
app.listen(port, () => console.log(`Server is running on port ${port}...`));
```
