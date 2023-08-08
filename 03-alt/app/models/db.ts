interface Category {
    CategoryID: number;
    CategoryName: string;
    Description: string;
    Picture: string;
}

interface Cusomer {
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

interface Employee {
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

interface OrderDetail {
    OrderID: number;
    ProductID: number;
    UnitPrice: number;
    Quantity: number;
    Discount: number;
}

interface Product {
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

interface Region {
    RegionID: number;
    RegionDescription: string;
}

interface Supplier {
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

interface Territory {
    TerritoryID: string;
    TerritoryDescription: string;
    RegionID: number;
}