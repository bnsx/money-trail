-- CreateTable
CREATE TABLE `categories` (
    `categoryID` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `memberID` VARCHAR(100) NOT NULL,
    `count` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` DATETIME(3) NULL,

    INDEX `categories_users_FK`(`memberID`),
    PRIMARY KEY (`categoryID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `txid` VARCHAR(100) NOT NULL,
    `amount` DECIMAL(10, 2) NOT NULL,
    `title` VARCHAR(25) NOT NULL,
    `description` VARCHAR(255) NULL,
    `type` ENUM('income', 'expense') NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `isoNumeric` SMALLINT UNSIGNED NOT NULL,
    `memberID` VARCHAR(100) NOT NULL,
    `categoryID` VARCHAR(100) NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` DATETIME(3) NULL,

    INDEX `transactions_categories_FK`(`categoryID`),
    INDEX `transactions_users_FK`(`memberID`),
    INDEX `transactions_countries_FK`(`isoNumeric`),
    PRIMARY KEY (`txid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `members` (
    `memberID` VARCHAR(100) NOT NULL,
    `username` VARCHAR(25) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'staff') NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `provider` VARCHAR(10) NOT NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `deletedAt` DATETIME(3) NULL,
    `isoNumeric` SMALLINT UNSIGNED NULL,

    UNIQUE INDEX `members_username_key`(`username`),
    UNIQUE INDEX `members_email_key`(`email`),
    INDEX `members_countries_FK`(`isoNumeric`),
    PRIMARY KEY (`memberID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `countries` (
    `name` VARCHAR(200) NOT NULL,
    `currencyCode` CHAR(3) NOT NULL,
    `currencyName` VARCHAR(32) NOT NULL,
    `currrencySymbol` VARCHAR(20) NOT NULL,
    `isoChar2` VARCHAR(2) NOT NULL,
    `isoChar3` VARCHAR(3) NOT NULL,
    `isoNumeric` SMALLINT UNSIGNED NOT NULL,
    `nameTH` VARCHAR(100) NOT NULL,
    `count` INTEGER UNSIGNED NOT NULL DEFAULT 0,

    PRIMARY KEY (`isoNumeric`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_users_FK` FOREIGN KEY (`memberID`) REFERENCES `members`(`memberID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_categories_FK` FOREIGN KEY (`categoryID`) REFERENCES `categories`(`categoryID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_countries_FK` FOREIGN KEY (`isoNumeric`) REFERENCES `countries`(`isoNumeric`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_users_FK` FOREIGN KEY (`memberID`) REFERENCES `members`(`memberID`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `members` ADD CONSTRAINT `members_countries_FK` FOREIGN KEY (`isoNumeric`) REFERENCES `countries`(`isoNumeric`) ON DELETE NO ACTION ON UPDATE NO ACTION;
