interface Row {
    etag: string;
    partitionKey: string;
    rowKey: string;
    timestamp: Date;
}

export interface Category extends Row {
    CategoryID: number;
    CategoryName: string;
    Description: string;
    Picture: string;
}

export interface Customer extends Row {
    CustomerID: string;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    Phone: string;
    Fax: string;
}

export interface Employee extends Row {
    EmployeeID: number;
    LastName: string;
    FirstName: string;
    Title: string;
    TitleOfCourtesy: string;
    BirthDate: Date;
    HireDate: Date;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    HomePhone: string;
    Extension: string;
    Photo: string;
    Notes: string;
    ReportsTo: number;
    PhotoPath: string;
}

export interface OrderDetail extends Row {
    OrderID: number;
    ProductID: number;
    UnitPrice: number;
    Quantity: number;
    Discount: number;
}

export interface Order extends Row {
    OrderID: number,
    CustomerID: string,
    EmployeeID: number,
    OrderDate: string,
    RequiredDate?: string,
    ShippedDate?: string,
    OrderDetails: OrderDetail[],
    ShipVia: string,
    Freight: 11.61,
    ShipName: "Toms Spezialitäten",
    ShipAddress: "Luisenstr. 48",
    ShipCity: "Münster",
    ShipRegion: null,
    ShipPostalCode: "44087",
    ShipCountry: "Germany"
}

export interface Product extends Row {
    ProductID: number;
    ProductName: string;
    SupplierID: number;
    CategoryID: number;
    QuantityPerUnit: string;
    UnitPrice: number;
    UnitsInStock: number;
    UnitsOnOrder: number;
    ReorderLevel: number;
    Discontinued: boolean;
}

export interface Supplier extends Row {
    SupplierID: number;
    CompanyName: string;
    ContactName: string;
    ContactTitle: string;
    Address: string;
    City: string;
    Region: string;
    PostalCode: string;
    Country: string;
    Phone: string;
    Fax: string;
    HomePage: string;
}
