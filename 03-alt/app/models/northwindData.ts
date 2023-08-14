import {
    TABLE_NAME, Category, Customer, Employee, Order, Product, Supplier
} from './db';

import { TableClient } from "@azure/data-tables";
import config from "../../config";

//#region Customers --------------------------------------------------------------------------------------

export const getCustomers = async (): Promise<Customer[]> => {
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.CUSTOMER);
    const entities = tableClient.listEntities();
    let result = [];
    for await (const entity of entities) {
        result.push(entity);
    }
    return result;
};

export const getCustomer = async (customerId: number): Promise<Customer> => {
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.CUSTOMER);
    const customer = await tableClient.getEntity(TABLE_NAME.CUSTOMER, customerId.toString()) as Customer;
    return customer;
};

export const createCustomer = async (customer: Customer): Promise<void> => {
    const newCustomer: Customer = {
        partitionKey: "Customers",
        rowKey: customer.CustomerID,
        ...customer,
    }
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.CUSTOMER);
    await tableClient.createEntity(newCustomer);
};

export const deleteCustomer = async (customerId: number): Promise<void> => {
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.CUSTOMER);
    await tableClient.deleteEntity(TABLE_NAME.CUSTOMER, customerId.toString());
};

export const updateCustomer = async (updatedCustomer: Customer): Promise<void> => {
    const tableClient = TableClient.fromConnectionString(config.tableConnectionString, TABLE_NAME.CUSTOMER);
    const customer = await tableClient.getEntity(TABLE_NAME.CUSTOMER, updatedCustomer.CustomerID) as Customer;
    if (!customer) {
        throw new Error("Customer not found");
    }
    await tableClient.updateEntity({ ...customer, ...updatedCustomer }, "Merge");
};

//#endregion

//#region Orders -----------------------------------------------------------------------------------------

// export async function getOrdersByEmployee(employeeID: number): Promise<Order[]> { return []; }

// Note this function should return the order and denormalized order details:
// export async function getOrder(): Promise<Order> { return null }

//#endregion

//#region Products and Categories ------------------------------------------------------------------------

// export async function getCategories(): Promise<Category[]> { return []; }

// export async function getProductsByCategory(categoryID: number): Promise<Product> { return null }

// export async function getProductById(productID: number): Promise<Product> { return null }

// export async function updateProductInventory(productID: number, unitsInStock: number): Promise<void> { }

// export async function getProduct(): Promise<Product> { return null }

//#endregion

//#region Suppliers ---------------------------------------------------------------------------------------

// export async function getSuppliers() : Promise<Supplier> { return null }

//#endregion

