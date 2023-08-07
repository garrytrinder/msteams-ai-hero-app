import * as restify from "restify";
import app from "./app/app";
import adapter from "./adapter";

// create server
const server = restify.createServer();

// parse request body
server.use(restify.plugins.bodyParser());

// start server
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nBot Started, ${server.name} listening to ${server.url}`);
});

// Listen for incoming requests
server.post("/api/messages", async (req, res) => {
  await adapter.process(req, res, async (context) => {
    await app.run(context);
  });
});

// Serve static tab files
server.get(
  "/*",
  restify.plugins.serveStatic({
    directory: `${__dirname}/app/pages/dist`,
  })
);

export default server;