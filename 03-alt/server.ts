import * as restify from "restify";
import { postMessages } from "./app/routes/messages";
import { deleteCustomer, getCustomer, getCustomers, patchCustomer, postCustomer } from "./app/routes/customers";
import { getConfig } from "./app/routes/config";

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
server.get("/api/customers", getCustomers);
server.get("/api/customers/:id", getCustomer);
server.post("/api/customers", postCustomer);
server.del("/api/customers/:id", deleteCustomer);
server.patch("/api/customers/:id", patchCustomer);
server.get("/api/config", getConfig);

// Serve static tab files
server.get(
  "/*",
  restify.plugins.serveStatic({
    directory: `${__dirname}/app/pages/dist`,
  })
);

export default server;