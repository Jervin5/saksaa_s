/*
  SAKSAAS Artisan Jewellery - MSSQL Database Schema
  Project: PHP + MSSQL Integration
  
  This script creates the complete database structure for the SAKSAAS e-commerce platform.
  It includes tables for Users, Products, Orders, Wishlist, and Customizations.
*/

-- 1. Create the Database
-- CREATE DATABASE saksaas;
-- GO
-- USE saksaas;
-- GO

-- =================================================================================
-- 2. USERS TABLE
-- Why: To store customer profiles, login credentials, and default shipping info.
-- Relationship: One user can have many Orders and many Wishlist items.
-- =================================================================================
CREATE TABLE Users (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    Role NVARCHAR(20) DEFAULT 'Customer', -- 'Customer' or 'Admin'
    Phone NVARCHAR(20),
    AddressLine1 NVARCHAR(255),
    City NVARCHAR(100),
    Pincode NVARCHAR(10),
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- =================================================================================
-- 3. CATEGORIES TABLE
-- Why: To organize products (Bangles, Earrings, Necklace) for easier filtering.
-- Relationship: One category contains many Products.
-- =================================================================================
CREATE TABLE Categories (
    CategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryName NVARCHAR(50) NOT NULL UNIQUE,
    CategoryImageURL NVARCHAR(MAX)
);

-- =================================================================================
-- 3.1 SUB-CATEGORIES TABLE
-- Why: To allow deeper filtering (e.g., Earrings -> Jhumkas, Studs).
-- Relationship: One Category has many Sub-Categories.
-- =================================================================================
CREATE TABLE SubCategories (
    SubCategoryID INT PRIMARY KEY IDENTITY(1,1),
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID) ON DELETE CASCADE,
    SubCategoryName NVARCHAR(50) NOT NULL,
    UNIQUE(CategoryID, SubCategoryName)
);

-- =================================================================================
-- 4. PRODUCTS TABLE
-- Why: The core table storing jewellery details, prices, and marketing flags.
-- Relationship: Linked to Categories and SubCategories.
-- =================================================================================
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY(1,1),
    CategoryID INT FOREIGN KEY REFERENCES Categories(CategoryID),
    SubCategoryID INT FOREIGN KEY REFERENCES SubCategories(SubCategoryID),
    Name NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    Price DECIMAL(10, 2) NOT NULL,
    MainImageURL NVARCHAR(MAX) NOT NULL,
    StockQuantity INT DEFAULT 0,
    IsTrending BIT DEFAULT 0,
    IsTopSelling BIT DEFAULT 0,
    IsNewArrival BIT DEFAULT 0,
    IsUnder500 BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- =================================================================================
-- 5. PRODUCT_IMAGES TABLE
-- Why: Products often have multiple gallery images (as seen in ProductDetail).
-- Relationship: Many images belong to one Product.
-- =================================================================================
CREATE TABLE ProductImages (
    ImageID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT FOREIGN KEY REFERENCES Products(ProductID) ON DELETE CASCADE,
    ImageURL NVARCHAR(MAX) NOT NULL
);

-- =================================================================================
-- 6. PRODUCT_SIZES TABLE
-- Why: Specifically for Bangles (2.2, 2.4, etc.) to manage available stock sizes.
-- Relationship: Many sizes can be mapped to one Product.
-- =================================================================================
CREATE TABLE ProductSizes (
    SizeID INT PRIMARY KEY IDENTITY(1,1),
    ProductID INT FOREIGN KEY REFERENCES Products(ProductID) ON DELETE CASCADE,
    SizeValue NVARCHAR(10) NOT NULL -- e.g., '2.4', '2.6'
);

-- =================================================================================
-- 7. ORDERS TABLE
-- Why: To store the "Header" of a purchase (who bought it, when, and where to ship).
-- Relationship: Linked to Users. Contains many OrderItems.
-- =================================================================================
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    OrderDate DATETIME DEFAULT GETDATE(),
    TotalAmount DECIMAL(10, 2) NOT NULL,
    Status NVARCHAR(50) DEFAULT 'Processing', -- Processing, Shipped, Delivered, Cancelled
    PaymentMethod NVARCHAR(50),               -- UPI, Card, COD
    ShippingAddress NVARCHAR(MAX) NOT NULL,
    TrackingNumber NVARCHAR(100),             -- For the tracking feature
    LastUpdateLocation NVARCHAR(255)          -- Current location for live tracking
);

-- =================================================================================
-- 8. ORDER_ITEMS TABLE
-- Why: To store the specific products, quantities, and sizes chosen in an order.
-- Relationship: Linked to Orders and Products.
-- =================================================================================
CREATE TABLE OrderItems (
    OrderItemID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT FOREIGN KEY REFERENCES Orders(OrderID) ON DELETE CASCADE,
    ProductID INT FOREIGN KEY REFERENCES Products(ProductID),
    Quantity INT NOT NULL DEFAULT 1,
    UnitPrice DECIMAL(10, 2) NOT NULL,
    SelectedSize NVARCHAR(10) -- The specific size chosen by the user
);

-- =================================================================================
-- 9. WISHLIST TABLE
-- Why: To persist the "Bookmark" feature across sessions.
-- Relationship: Links a User to a Product they like.
-- =================================================================================
CREATE TABLE Wishlist (
    WishlistID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID) ON DELETE CASCADE,
    ProductID INT FOREIGN KEY REFERENCES Products(ProductID) ON DELETE CASCADE,
    AddedAt DATETIME DEFAULT GETDATE(),
    UNIQUE(UserID, ProductID) -- Prevents duplicate bookmarks for the same item
);

-- =================================================================================
-- 10. CUSTOM_REQUESTS TABLE
-- Why: For the "Customise Your Set" feature where users upload outfit photos.
-- Relationship: Linked to Users.
-- =================================================================================
CREATE TABLE CustomRequests (
    RequestID INT PRIMARY KEY IDENTITY(1,1),
    UserID INT FOREIGN KEY REFERENCES Users(UserID),
    OutfitImageURL NVARCHAR(MAX),
    Occasion NVARCHAR(100),
    BudgetRange NVARCHAR(100),
    Preferences NVARCHAR(MAX),
    Status NVARCHAR(50) DEFAULT 'Pending',
    CreatedAt DATETIME DEFAULT GETDATE()
);

-- =================================================================================
-- INDEXING FOR PERFORMANCE
-- =================================================================================
CREATE INDEX IX_Products_Category ON Products(CategoryID);
CREATE INDEX IX_Orders_User ON Orders(UserID);
CREATE INDEX IX_OrderItems_Order ON OrderItems(OrderID);
CREATE INDEX IX_Wishlist_User ON Wishlist(UserID);
