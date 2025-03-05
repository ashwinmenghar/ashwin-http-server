import http from "http";

const getHtml = () => {
  return `<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
      <h1>Any fool can write code that a computer can understand. Good programmers write code that humans can understand.</h1>
      <p> - Martin Fowler</p>

  </body>
</html>`;
};

const sendResponse = (res, status, contentType, content) => {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(content);
};

const routes = {
  "/html": (res) => sendResponse(res, 200, "text/html", getHtml()),
};

const server = http.createServer((req, res) => {
  const path = req.url;
  console.log(path);

  if (req.method != "GET") {
    sendResponse(res, 405, "text/plain", "Method Not Allowed");
  }
  try {
    if (routes[path]) {
      return routes[path](res);
    }

    return sendResponse(res, 404, "text/plain", "404 Not Found");
  } catch (error) {
    sendResponse(res, 500, "text/plain", "Internal server error");
  }
});

server.listen(8000, () => console.log("server running at port 8000"));
