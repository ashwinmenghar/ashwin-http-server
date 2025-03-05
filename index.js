import http from "http";
import { v4 as uuidv4 } from "uuid";

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

const getJson = () => {
  return {
    slideshow: {
      author: "Yours Truly",
      date: "date of publication",
      slides: [
        {
          title: "Wake up to WonderWidgets!",
          type: "all",
        },
        {
          items: [
            "Why <em>WonderWidgets</em> are great",
            "Who <em>buys</em> WonderWidgets",
          ],
          title: "Overview",
          type: "all",
        },
      ],
      title: "Sample Slide Show",
    },
  };
};

const sendResponse = (res, status, contentType, content) => {
  res.writeHead(status, { "Content-Type": contentType });
  res.end(content);
};

const routes = {
  "/html": (res) => sendResponse(res, 200, "text/html", getHtml()),
  "/json": (res) =>
    sendResponse(res, 200, "application/json", JSON.stringify(getJson())),
  "/uuid": (res) =>
    sendResponse(
      res,
      200,
      "application/json",
      JSON.stringify({ uuid: uuidv4() })
    ),
};

const server = http.createServer((req, res) => {
  const path = req.url;

  if (req.method != "GET") {
    sendResponse(res, 405, "text/plain", "Method Not Allowed");
  }

  try {
    if (routes[path]) {
      return routes[path](res);
    }

    const [_, route, param] = path.split("/");

    if (route == "status") {
      const statusCode = parseInt(param);

      if (!isNaN(statusCode) && statusCode >= 100 && statusCode <= 599) {
        return sendResponse(
          res,
          200,
          "text/plain",
          `Response with status code: ${statusCode}`
        );
      } else {
        return sendResponse(res, 400, "text/plain", "Invalid status code");
      }
    }

    return sendResponse(res, 404, "text/plain", "404 Not Found");
  } catch (error) {
    sendResponse(res, 500, "text/plain", "Internal server error");
  }
});

server.listen(8000, () => console.log("server running at port 8000"));
