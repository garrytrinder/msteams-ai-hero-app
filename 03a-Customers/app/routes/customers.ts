import { Customer } from "../models/db";
import * as NorthwindData from "../models/northwindData";

export const getCustomers = async (req, res) => {
    const startsWith = req.query.startsWith as string;
    const customers = await NorthwindData.getCustomers(startsWith);
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