## Pretty Pics API Demo
This demo shows the use of Node using express to make a get API. In this example the user will be able to request a background image from `http://some url/api/bg/dog` and able to embed it in their css or page.

Example:

```
body {
    background-image: url(http://localhost:8080/api/bg/dog);
}
```

You will also find that this application makes use of clustering. When one of the clusters crash then a new one will auto spawn to take it's place.

In this demo I used the Flickr API to search for completely free to use images such as `dog`, `cat`, `flowers`, etc. The image will also be cached on the server so we do not need to redownload them.

## Installing
Clone this repo: `git clone https://github.com/FalseFlash/Pretty-Pics-API-Demo.git`
Run `npm install`

You will then need to get a [Flickr API key](https://www.flickr.com/services/api/) and update the API key in server.js. I would not suggest using these Flickr images in production unless you know the exact license of each image.

## Running the Application
Simply run `node server` and then open `image.html` and refresh a few times to see the changes.

You can also go to `http://localhost:8080/api/bg/cat` or `http://localhost:8080/api/bg/plants`. Try changing the search params and play around with it.