-- =================================================================================
-- SAKSAAS Artisan Jewellery — Complete MySQL Database Schema
-- Engine : MySQL 8.x  (InnoDB, utf8mb4)
-- File   : database_schema.sql
--
-- TABLE OVERVIEW & WHERE EACH IS USED
-- ─────────────────────────────────────────────────────────────────────────────
-- Users            → Login, Signup, AccountDetails, Checkout (auto-fill address)
-- Categories       → Shop page filter sidebar, Admin dashboard
-- SubCategories    → Shop page sub-filter, product cards
-- Products         → Shop, Home (trending/new), ProductDetail, AdminDashboard
-- ProductImages    → ProductDetail image gallery carousel
-- ProductSizes     → ProductDetail size selector, Cart item, OrderItems
-- Orders           → Orders page list, OrderDetail, AdminDashboard stats
-- OrderItems       → OrderDetail items list, order confirmation
-- Wishlist         → Wishlist page, ProductCard bookmark icon state
-- CustomRequests   → Customise page form submission, Admin review
-- Notifications    → Notification bell in Layout/header for users & admins
-- TrackingHistory  → OrderTracking page step-by-step timeline
-- =================================================================================

CREATE DATABASE IF NOT EXISTS saksaas
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE saksaas;

-- =================================================================================
-- 1. USERS
-- Used in  : Login, Signup, AccountDetails, Checkout (pre-fill), Admin user list
-- Links to : Orders (1→many), Wishlist (1→many), CustomRequests (1→many),
--            Notifications (1→many)
-- Added    : ProfileImage column (needed by uploadImage API & AccountDetails page)
-- =================================================================================
CREATE TABLE IF NOT EXISTS Users (
    UserID       INT          PRIMARY KEY AUTO_INCREMENT,
    FullName     VARCHAR(100) NOT NULL,
    Email        VARCHAR(100) NOT NULL UNIQUE,
    PasswordHash VARCHAR(255) NOT NULL,
    Role         VARCHAR(20)  NOT NULL DEFAULT 'Customer',  -- 'Customer' | 'Admin'
    Phone        VARCHAR(20),
    AddressLine1 VARCHAR(255),
    City         VARCHAR(100),
    Pincode      VARCHAR(10),
    ProfileImage VARCHAR(500),                              -- stored path: /uploads/profiles/xxx.jpg
    CreatedAt    DATETIME     NOT NULL DEFAULT NOW()
) ENGINE=InnoDB;

-- =================================================================================
-- 2. CATEGORIES
-- Used in  : Shop filter sidebar (Bangles / Earrings / Necklace / Hair Accessories)
--            Admin dashboard product form dropdown
-- Links to : Products (1→many), SubCategories (1→many)
-- =================================================================================
CREATE TABLE IF NOT EXISTS Categories (
    CategoryID       INT          PRIMARY KEY AUTO_INCREMENT,
    CategoryName     VARCHAR(50)  NOT NULL UNIQUE,  -- 'Bangles', 'Earrings', etc.
    CategoryImageURL VARCHAR(500)                    -- hero image for category page
) ENGINE=InnoDB;

-- Seed default categories so the shop filter works immediately
INSERT IGNORE INTO Categories (CategoryName) VALUES
    ('Bangles'),
    ('Earrings'),
    ('Necklace'),
    ('Hair Accessories');

-- =================================================================================
-- 3. SUB-CATEGORIES
-- Used in  : Shop page sub-filter chips (Jhumkas, Studs, Kundan, Modern…)
--            ProductCard badge, ProductDetail breadcrumb
-- Links to : Categories (many→1), Products (1→many)
-- =================================================================================
CREATE TABLE IF NOT EXISTS SubCategories (
    SubCategoryID   INT         PRIMARY KEY AUTO_INCREMENT,
    CategoryID      INT         NOT NULL,
    SubCategoryName VARCHAR(50) NOT NULL,
    UNIQUE KEY uq_cat_sub (CategoryID, SubCategoryName),
    CONSTRAINT fk_subcat_cat FOREIGN KEY (CategoryID)
        REFERENCES Categories(CategoryID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed sub-categories
INSERT IGNORE INTO SubCategories (CategoryID, SubCategoryName)
SELECT CategoryID, sub FROM Categories
CROSS JOIN (
    SELECT 'Traditional' AS sub UNION SELECT 'Modern' UNION SELECT 'Bridal'
    UNION SELECT 'Kundan'       UNION SELECT 'Oxidized'
) t WHERE CategoryName = 'Bangles';

INSERT IGNORE INTO SubCategories (CategoryID, SubCategoryName)
SELECT CategoryID, sub FROM Categories
CROSS JOIN (
    SELECT 'Jhumkas'             AS sub
    UNION SELECT 'Studs'
    UNION SELECT 'Hanging'
    UNION SELECT 'Modern Jhumkas'
    UNION SELECT 'Silk Thread Jhumkas'
    UNION SELECT 'Traditional Jhumkas'
) t WHERE CategoryName = 'Earrings';

-- =================================================================================
-- 4. PRODUCTS
-- Used in  : Shop page grid, Home page sections (trending / new arrivals / top selling)
--            ProductDetail page, Cart, AdminDashboard CRUD
-- Links to : Categories (many→1), SubCategories (many→1),
--            ProductImages (1→many), ProductSizes (1→many),
--            OrderItems (1→many), Wishlist (1→many)
-- Note     : StockQuantity drives inStock flag; 0 = out of stock badge on card
-- =================================================================================
CREATE TABLE IF NOT EXISTS Products (
    ProductID     INT            PRIMARY KEY AUTO_INCREMENT,
    CategoryID    INT,
    SubCategoryID INT,
    Name          VARCHAR(200)   NOT NULL,
    Description   TEXT,
    Price         DECIMAL(10,2)  NOT NULL,
    MainImageURL  VARCHAR(500)   NOT NULL,
    StockQuantity INT            NOT NULL DEFAULT 0,
    IsTrending    TINYINT(1)     NOT NULL DEFAULT 0,
    IsTopSelling  TINYINT(1)     NOT NULL DEFAULT 0,
    IsNewArrival  TINYINT(1)     NOT NULL DEFAULT 0,
    IsUnder500    TINYINT(1)     NOT NULL DEFAULT 0,
    CreatedAt     DATETIME       NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_prod_cat    FOREIGN KEY (CategoryID)    REFERENCES Categories(CategoryID)    ON DELETE SET NULL,
    CONSTRAINT fk_prod_subcat FOREIGN KEY (SubCategoryID) REFERENCES SubCategories(SubCategoryID) ON DELETE SET NULL,
    INDEX idx_prod_cat (CategoryID),
    INDEX idx_prod_trending (IsTrending),
    INDEX idx_prod_new (IsNewArrival)
) ENGINE=InnoDB;

-- =================================================================================
-- 5. PRODUCT IMAGES
-- Used in  : ProductDetail image gallery (thumbnails + main image switcher)
--            AdminDashboard multi-image upload
-- Links to : Products (many→1)
-- =================================================================================
CREATE TABLE IF NOT EXISTS ProductImages (
    ImageID   INT          PRIMARY KEY AUTO_INCREMENT,
    ProductID INT          NOT NULL,
    ImageURL  VARCHAR(500) NOT NULL,
    SortOrder TINYINT      NOT NULL DEFAULT 0,   -- controls display order in gallery
    CONSTRAINT fk_img_prod FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================================================================================
-- 6. PRODUCT SIZES
-- Used in  : ProductDetail size selector buttons (2.2 / 2.4 / 2.6 / 2.8 etc.)
--            Cart item display, OrderItems.SelectedSize
-- Links to : Products (many→1)
-- =================================================================================
CREATE TABLE IF NOT EXISTS ProductSizes (
    SizeID    INT         PRIMARY KEY AUTO_INCREMENT,
    ProductID INT         NOT NULL,
    SizeValue VARCHAR(10) NOT NULL,   -- '2.2', '2.4', 'Free Size', 'S', 'M' etc.
    CONSTRAINT fk_size_prod FOREIGN KEY (ProductID)
        REFERENCES Products(ProductID) ON DELETE CASCADE
) ENGINE=InnoDB;

-- =================================================================================
-- 7. ORDERS
-- Used in  : Checkout page (createOrder), Orders page list, OrderDetail,
--            AdminDashboard orders table, OrderTracking page
-- Links to : Users (many→1), OrderItems (1→many), TrackingHistory (1→many),
--            Notifications (trigger on status change)
-- =================================================================================
CREATE TABLE IF NOT EXISTS Orders (
    OrderID              INT            PRIMARY KEY AUTO_INCREMENT,
    UserID               INT            NOT NULL,
    OrderDate            DATETIME       NOT NULL DEFAULT NOW(),
    TotalAmount          DECIMAL(10,2)  NOT NULL,
    Status               VARCHAR(50)    NOT NULL DEFAULT 'Processing',
        -- 'Processing' → 'Shipped' → 'Out for Delivery' → 'Delivered' | 'Cancelled'
    PaymentMethod        VARCHAR(50),   -- 'card', 'upi', 'cod'
    ShippingAddress      TEXT           NOT NULL,
    TrackingNumber       VARCHAR(100),  -- courier AWB number; shown on OrderTracking page
    LastUpdateLocation   VARCHAR(255),  -- e.g. "Arrived at Bangalore Hub"
    CONSTRAINT fk_ord_user FOREIGN KEY (UserID)
        REFERENCES Users(UserID) ON DELETE CASCADE,
    INDEX idx_ord_user   (UserID),
    INDEX idx_ord_status (Status)
) ENGINE=InnoDB;

-- =================================================================================
-- 8. ORDER ITEMS
-- Used in  : OrderDetail items list, Admin order view
--            Also feeds back to product sales stats for AdminDashboard
-- Links to : Orders (many→1), Products (many→1)
-- Note     : We cache Name + ImageURL so the order detail still renders
--            even if the product is later deleted from the catalogue
-- =================================================================================
CREATE TABLE IF NOT EXISTS OrderItems (
    OrderItemID  INT           PRIMARY KEY AUTO_INCREMENT,
    OrderID      INT           NOT NULL,
    ProductID    INT,                             -- nullable: product may be deleted
    Quantity     INT           NOT NULL DEFAULT 1,
    UnitPrice    DECIMAL(10,2) NOT NULL,
    SelectedSize VARCHAR(10),                     -- bangle size chosen at checkout
    Name         VARCHAR(200)  NOT NULL,          -- snapshot at time of purchase
    ImageURL     VARCHAR(500)  NOT NULL,          -- snapshot — prevents broken images
    CONSTRAINT fk_oi_order   FOREIGN KEY (OrderID)   REFERENCES Orders(OrderID)   ON DELETE CASCADE,
    CONSTRAINT fk_oi_product FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE SET NULL,
    INDEX idx_oi_order (OrderID)
) ENGINE=InnoDB;

-- =================================================================================
-- 9. WISHLIST
-- Used in  : Wishlist page grid, ProductCard bookmark icon (filled/unfilled state)
-- Links to : Users (many→1), Products (many→1)
-- Unique   : One user can save a product only once (prevents duplicates)
-- =================================================================================
CREATE TABLE IF NOT EXISTS Wishlist (
    WishlistID INT      PRIMARY KEY AUTO_INCREMENT,
    UserID     INT      NOT NULL,
    ProductID  INT      NOT NULL,
    AddedAt    DATETIME NOT NULL DEFAULT NOW(),
    UNIQUE KEY uq_wish (UserID, ProductID),
    CONSTRAINT fk_wish_user FOREIGN KEY (UserID)    REFERENCES Users(UserID)       ON DELETE CASCADE,
    CONSTRAINT fk_wish_prod FOREIGN KEY (ProductID) REFERENCES Products(ProductID) ON DELETE CASCADE,
    INDEX idx_wish_user (UserID)
) ENGINE=InnoDB;

-- =================================================================================
-- 10. CUSTOM REQUESTS
-- Used in  : Customise page form (submitCustomRequest),
--            AdminDashboard "Custom Requests" tab (view, update status)
-- Links to : Users (many→1)
-- =================================================================================
CREATE TABLE IF NOT EXISTS CustomRequests (
    RequestID      INT          PRIMARY KEY AUTO_INCREMENT,
    UserID         INT,
    OutfitImageURL VARCHAR(500),           -- uploaded outfit photo path
    Occasion       VARCHAR(100),           -- 'Wedding', 'Festival', 'Casual', etc.
    BudgetRange    VARCHAR(100),           -- '₹500-₹1000', '₹1000-₹2000', etc.
    Preferences    TEXT,                   -- free-text notes from customer
    Status         VARCHAR(50) NOT NULL DEFAULT 'Pending',
        -- 'Pending' → 'In Review' → 'Quote Sent' → 'Confirmed' | 'Rejected'
    AdminNotes     TEXT,                   -- internal notes added by admin
    CreatedAt      DATETIME    NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_cr_user FOREIGN KEY (UserID)
        REFERENCES Users(UserID) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =================================================================================
-- 11. NOTIFICATIONS
-- Used in  : Notification bell icon in Layout header (badge count + dropdown list)
--            Triggered automatically when: order placed, order status updated,
--            custom request status updated
-- Links to : Users (many→1)
-- =================================================================================
CREATE TABLE IF NOT EXISTS Notifications (
    NotificationID INT          PRIMARY KEY AUTO_INCREMENT,
    UserID         INT          NOT NULL,
    Title          VARCHAR(200) NOT NULL,  -- e.g. "Order #42 Shipped!"
    Message        TEXT         NOT NULL,  -- e.g. "Your order is on the way..."
    Type           VARCHAR(50)  NOT NULL DEFAULT 'order',
        -- 'order' | 'custom_request' | 'promo' | 'system'
    IsRead         TINYINT(1)   NOT NULL DEFAULT 0,
    LinkURL        VARCHAR(255),           -- e.g. '/order/42' — clicked from bell
    CreatedAt      DATETIME     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_notif_user FOREIGN KEY (UserID)
        REFERENCES Users(UserID) ON DELETE CASCADE,
    INDEX idx_notif_user_read (UserID, IsRead)
) ENGINE=InnoDB;

-- =================================================================================
-- 12. TRACKING HISTORY
-- Used in  : OrderTracking page step timeline (each row = one tracking event)
--            OrderDetail timeline section
-- Links to : Orders (many→1)
-- Note     : Each status change in Orders also inserts a row here for full history
-- =================================================================================
CREATE TABLE IF NOT EXISTS TrackingHistory (
    TrackID     INT          PRIMARY KEY AUTO_INCREMENT,
    OrderID     INT          NOT NULL,
    Status      VARCHAR(100) NOT NULL,   -- 'Order Placed', 'Shipped', 'In Transit'…
    Location    VARCHAR(255),            -- 'Bangalore Hub', 'Delhi Sorting Centre'
    Description VARCHAR(500),            -- friendly message shown on tracking page
    EventTime   DATETIME     NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_track_order FOREIGN KEY (OrderID)
        REFERENCES Orders(OrderID) ON DELETE CASCADE,
    INDEX idx_track_order (OrderID)
) ENGINE=InnoDB;

-- =================================================================================
-- PERFORMANCE INDEXES (additional)
-- =================================================================================
CREATE INDEX idx_products_price     ON Products(Price);
CREATE INDEX idx_orders_date        ON Orders(OrderDate);
CREATE INDEX idx_notif_created      ON Notifications(CreatedAt);
CREATE INDEX idx_tracking_time      ON TrackingHistory(EventTime);