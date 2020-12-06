DROP DATABASE IF EXISTS PonyList;
CREATE DATABASE PonyList; 

USE PonyList;

-- -----------------------------------------------------
-- Table PonyListBackend.Users
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Users (
  UserID INT NOT NULL AUTO_INCREMENT,
  Username VARCHAR(45) NULL,
  Password VARCHAR(200) NULL,
  OnCampus VARCHAR(45) NULL,
  Dorm VARCHAR(45) NULL,
  NumSales INT NULL,
  IsStudent VARCHAR(45) NULL,
  Location VARCHAR(45) NULL,
  Rating DECIMAL(3,1) NULL,
  MilesAway INT NULL,
  PRIMARY KEY (UserID)
  );


INSERT INTO Users (Username, Password, OnCampus, Dorm, NumSales, IsStudent, Location, Rating, MilesAway) Values 
  ('admin', 'password', 'YES', 'Ware', 0, 'Yes', 'Campus', 0.0, 0),
    ('bestUser', 'password', 'YES', 'Ware', 15, 'Yes', 'Campus', 5.0, 0),
      ('seller1', 'password', 'YES', 'Crum', 9, 'Yes', 'Campus', 4.8, 0);


-- -----------------------------------------------------
-- Table PonyListBackend.Items
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Items (
  ItemID INT NOT NULL AUTO_INCREMENT,
  SellerID INT NOT NULL,
  ItemName VARCHAR(45) NULL,
  ItemCost DECIMAL(10,2) NULL,
  ItemDetails VARCHAR(250) NULL,
  IsSold VARCHAR(45) NULL,
  ImageURL VARCHAR(300) NULL,
  PRIMARY KEY (ItemID)
);

INSERT INTO Items (ItemID, SellerID, ItemName, ItemCost, ItemDetails, IsSold, ImageURL) VALUES 
  (1, 2, 'SQL Textbook', 10.99, 'A lightly used textbook from my DB class.', 'NO', 'https://d24f1whwu8r3u4.cloudfront.net/assets/book-covers/sql-016c2f5b2618b193b9932034f5911f0c10df31e575150cd741c7392b39a5fc77.png'),
    (2, 3, 'Pencil Case', 4.35, 'I bought this pencil case but I do not like the color, never used', 'NO', 'https://images-na.ssl-images-amazon.com/images/I/513%2BjKd8STL._AC_SY400_.jpg');

-- -----------------------------------------------------
-- Table PonyListBackend.Messages
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Messages (
  MessageID INT NOT NULL AUTO_INCREMENT,
  RecipientID INT NOT NULL,
  SenderID INT NOT NULL,
  MessageText VARCHAR(255) NULL,
  PRIMARY KEY (MessageID)
);


-- -----------------------------------------------------
-- Table PonyListBackend.Reviews
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Reviews (
  ReviewID INT NOT NULL AUTO_INCREMENT,
  SellerID INT NOT NULL,
  ItemID INT NOT NULL,
  BuyerID INT NOT NULL,
  ReviewText VARCHAR(45) NULL,
  Rating DECIMAL(2,1) NULL,
  PRIMARY KEY (ReviewID)
);


-- -----------------------------------------------------
-- Table PonyListBackend.AvailableTimes
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS AvailableTimes (
  UserID INT NULL,
  Day VARCHAR(45) NULL,
  Time DATETIME NULL
);


-- -----------------------------------------------------
-- Table PonyListBackend.Ratings
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Ratings (
  RatingID INT NOT NULL AUTO_INCREMENT,
  BuyerID INT NULL,
  SellerID INT NULL,
  Rating DECIMAL(3,1) NULL,
  PRIMARY KEY (RatingID)
);


-- -----------------------------------------------------
-- Table PonyListBackend.Favorites
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Favorites (
  UserID INT NULL,
  ItemID INT NULL
  );


-- -----------------------------------------------------
-- Table PonyListBackend.SharedProducts
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS SharedProducts (
  UserID INT NULL,
  ItemID INT NULL
  );


-- -----------------------------------------------------
-- Table PonyListBackend.Transactions
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS Transactions (
  TransactionID INT NOT NULL AUTO_INCREMENT,
  BuyerID INT NOT NULL,
  SellerID INT NOT NULL,
  ItemID INT NOT NULL,
  SellPrice DECIMAL(10,2) NULL,
  PRIMARY KEY (TransactionID)
);
