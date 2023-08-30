import * as restify from "restify";
import { postMessages } from "./app/routes/messages";
import { getConfig } from "./app/routes/config";
import { postProfile } from "./app/routes/profile";

// create server
const server = restify.createServer();

// parse request body
server.use(restify.plugins.bodyParser());

// start server
server.listen(process.env.port || process.env.PORT || 3978, () => {
  console.log(`\nBot Started, ${server.name} listening to ${server.url}`);
});

// handle incoming messages
server.post("/api/messages", postMessages);
server.get("/api/config", getConfig);
server.post("/api/profile", postProfile);

// Serve static tab files
server.get(
  "/*",
  restify.plugins.serveStatic({
    directory: `${__dirname}/app/pages/dist`,
  })
);

export default server;