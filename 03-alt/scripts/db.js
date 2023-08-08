const { TableClient, TableServiceClient } = require("@azure/data-tables");
const fs = require("fs");
const path = require("path");

(async () => {

    const tableServiceClient = TableServiceClient.fromConnectionString("UseDevelopmentStorage=true");
    const tables = ["Categories", "Customers", "Employees", "Orders", "OrderDetails", "Products", "Regions", "Suppliers", "Territories"];
    tables.forEach(async (table) => await tableServiceClient.deleteTable(table));
    tables.forEach(async (table) => {
        await tableServiceClient.createTable(table);
        const tableClient = TableClient.fromConnectionString("UseDevelopmentStorage=true", table);
        const jsonString = fs.readFileSync(path.resolve(__dirname, "db", `${table}.json`), "utf8");
        const entities = JSON.parse(jsonString);
        if (table === "OrderDetails") {
            for (const entity of entities.OrderDetails) {
                const rowKey = `${entity.OrderID}_${entity.ProductID}`;
                await tableClient.createEntity({
                    partitionKey: table,
                    rowKey,
                    ...entity
                });
            }
        }
        else {
            for (const entity of entities[table]) {
                const rowKey = `${entity[Object.keys(entity)[0]]}`;
                console.log(`${table} - ${rowKey}`);
                await tableClient.createEntity({
                    partitionKey: table,
                    rowKey,
                    ...entity
                });
            }
        }
    });

})();