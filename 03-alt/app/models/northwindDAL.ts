import {
    Category, Customer, Employee, Order, Product, Supplier
} from './db';

export async function getCategories(): Promise<Category[]> { return []; }

export async function getCustomers(): Promise<Customer> { return null }

export async function getEmployees(): Promise<Employee> { return null }

export async function getOrders(): Promise<Order> { return null }

export async function getProduct(): Promise<Product> { return null }

export async function getSuppliers() : Promise<Supplier> { return null }


