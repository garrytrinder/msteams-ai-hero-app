import { TableClient } from "@azure/data-tables";
import config from "../../config";
import { randomUUID } from "crypto";
import { Customer } from "../models/db";

const TABLE_NAME = "Customers";

export const getCustomers = async (req, res) => {
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME);
    const entities = tableClient.listEntities();
    let result = [];
    for await (const entity of entities) {
        result.push(entity);
    }
    res.send(result);
};

export const getCustomer = async (req, res) => {
    const { id } = req.params;
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME);
    const customer = await tableClient.getEntity(TABLE_NAME, id);
    if (!customer) {
        res.status(404);
        return;
    }
    res.send(customer);
};

export const postCustomer = async (req, res) => {
    const rowKey = randomUUID();
    const newCustomer: Customer = {
        partitionKey: "Customers",
        rowKey,
        ...req.body,
    }
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME);
    await tableClient.createEntity(newCustomer);
    const customer = await tableClient.getEntity(TABLE_NAME, rowKey);
    res.send(customer);
};

export const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME);
    const customer = await tableClient.getEntity(TABLE_NAME, id) as Customer;
    if (!customer) {
        res.status(404);
        return;
    }
    await tableClient.deleteEntity(TABLE_NAME, id);
    res.status(204);
    res.send();
};

export const patchCustomer = async (req, res) => {
    const { id } = req.params;
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME);
    const customer = await tableClient.getEntity(TABLE_NAME, id) as Customer;
    if (!customer) {
        res.status(404);
        return;
    }
    await tableClient.updateEntity({ ...customer, ...req.body }, "Merge");
    const updatedCustomer = await tableClient.getEntity(TABLE_NAME, id);
    res.send(updatedCustomer);
};