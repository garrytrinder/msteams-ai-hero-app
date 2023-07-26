
import * as restify from "restify";
import app from "./app";
import adapter from "./app/bot/adapter";

const server = restify.createServer();
server.use(restify.plugins.bodyParser());

server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nBot Started, ${server.name} listening to ${server.url}`);
});

server.post("/api/messages", async (req, res) => {
  await adapter.process(req, res, async (context) => {
      await app.run(context);
  });
});

server.get(
  "/*",
  restify.plugins.serveStatic({
      directory: `${__dirname}/app/tab`,
  })
);

export default server;