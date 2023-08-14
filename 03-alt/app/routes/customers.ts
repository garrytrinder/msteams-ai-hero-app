import { TableClient } from "@azure/data-tables";
// import config from "../../config";
// import { randomUUID } from "crypto";
import { Customer } from "../models/db";
import * as NorthwindData from "../models/northwindData";

// const TABLE_NAME = "Customers";

export const getCustomers = async (req, res) => {
    const customers = await NorthwindData.getCustomers();
    res.send(customers);
};

export const getCustomer = async (req, res) => {
    const { id } = req.params;
    const customer = await NorthwindData.getCustomer(id);
    res.send(customer);
};

export const postCustomer = async (req, res) => {
    const newCustomer = req.body as Customer;
    await NorthwindData.createCustomer(newCustomer);
    res.send('OK');
};

export const deleteCustomer = async (req, res) => {
    const { id } = req.params;
    await NorthwindData.deleteCustomer(id);
    res.send('OK');
};

export const patchCustomer = async (req, res) => {
    await NorthwindData.updateCustomer(req.body);
    res.send('OK');
};