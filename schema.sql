-- Create Users Table
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    Password NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20),
    AddressLine1 NVARCHAR(255),
    City NVARCHAR(100),
    Pincode NVARCHAR(10),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- Create Products Table
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Category NVARCHAR(50) NOT NULL,
    Description NVARCHAR(MAX),
    ImageURL NVARCHAR(255),
    IsTrending BIT DEFAULT 0,
    IsNewArrival BIT DEFAULT 0,
    IsTopSelling BIT DEFAULT 0,
    IsUnder500 BIT DEFAULT 0
);

-- Create Orders Table
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Pending',
    PaymentMethod NVARCHAR(50),
    ShippingAddress NVARCHAR(MAX)
);

-- Create OrderItems Table
CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT FOREIGN KEY REFERENCES Orders(OrderID),
    ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
    Quantity INT NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    Size NVARCHAR(20)
);

-- Insert Sample Products
INSERT INTO Products (Name, Price, Category, Description, ImageURL, IsTrending, IsTopSelling)
VALUES ('Royal Gold Plated Bangles', 1250, 'Bangles', 'Exquisite gold-plated bangles handcrafted with intricate traditional patterns.', 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800', 1, 1);

INSERT INTO Products (Name, Price, Category, Description, ImageURL, IsTrending, IsNewArrival)
VALUES ('Kundan Jhumka Earrings', 850, 'Earrings', 'Elegant Kundan jhumkas with pearl drops.', 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&q=80&w=800', 1, 1);

INSERT INTO Products (Name, Price, Category, Description, ImageURL, IsTopSelling)
VALUES ('Temple Work Necklace Set', 2450, 'Necklace', 'Traditional temple work necklace featuring divine motifs.', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=800', 1);
