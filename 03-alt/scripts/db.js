const { TableClient, TableServiceClient } = require("@azure/data-tables");
const { randomUUID } = require("crypto");
const fs = require("fs");
const path = require("path");

(async () => {

    const tableServiceClient = TableServiceClient.fromConnectionString("UseDevelopmentStorage=true");
    const tables = ["Categories", "Customers", "Employees", "Orders", "OrderDetails", "Products", "Regions", "Suppliers", "Territories"];
    const rowKeyColumnNames = ["CategoryID", "CustomerID", "EmployeeID", "OrderID", null, "ProductID", "RegionID", "SupplierID", "TerritoryID"];

    tables.forEach(async (table) => await tableServiceClient.deleteTable(table));
    tables.forEach(async (table) => {
        const rowKeyColumnName = rowKeyColumnNames[tables.indexOf(table)];
        await tableServiceClient.createTable(table);
        const tableClient = TableClient.fromConnectionString("UseDevelopmentStorage=true", table);
        const jsonString = fs.readFileSync(path.resolve(__dirname, "db", `${table}.json`), "utf8");
        const entities = JSON.parse(jsonString);
        for (const entity of entities[table]) {
            const rowKey = rowKeyColumnName ? entity[rowKeyColumnName].toString() : randomUUID();
            console.log(`Added ${table} - ${rowKey}`);
            await tableClient.createEntity({
                partitionKey: table,
                rowKey,
                ...entity
            });
        }
    });
})();