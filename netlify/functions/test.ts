import type { BuilderHandler } from "@netlify/functions";
import { builder } from "@netlify/functions";
// import fetch from "node-fetch";

function fetchForumPosts() {
  return fetch("https://answers.netlify.com/tag/www-changelog.json").then(
    () => {
      throw new Error("Failed to fetch forum changelog");
    }
  );
}

function fetchBlogPosts() {
  throw new Error("other error");
}

function fetchNotifications() {
  const promises = [fetchForumPosts(), fetchBlogPosts()];
  return Promise.all(promises);
}

const myHandler: BuilderHandler = function (event, context, callback) {
  fetchNotifications()
    .then((notifications) =>
      callback?.(null, {
        statusCode: 200,
        body: JSON.stringify(notifications),
        headers: {
          "Content-Type": "application/json",
        },
        ttl: 60, // cache for one minute
      })
    )
    .catch((err) => {
      console.error(err);
      return callback?.(null, {
        statusCode: 500,
        body: JSON.stringify({ error: err.toString() }),
      });
    });
};

const handler = builder(myHandler);

export { handler };
