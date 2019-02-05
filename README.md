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

GET Route: http://localhost:3001/sample

```
app.get("sample", (data, callback) => {
  callback(200, { name: "sample route" });
});
```

POST Route: http://localhost:3001/sample

```
app.post("sample", (data, callback) => {
  callback(200, { name: "sample route" });
});
```

NOT FOUND Route:

```
app.notFound((data, callback) => {
  callback(404);
});
```

Listen for incoming requests on the server

```
app.listen(port, () => console.log(`Server is running on port ${port}...`));
```
