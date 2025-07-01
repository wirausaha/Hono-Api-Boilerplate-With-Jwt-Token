-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(32) NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "termsagrement" INTEGER NOT NULL DEFAULT 1,
    "userrole" VARCHAR(20) NOT NULL DEFAULT 'User',
    "accesstoken" VARCHAR(2048),
    "refreshtoken" VARCHAR(2048),
    "tokenexpiredate" TIMESTAMP(6),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tbsystoken" (
    "accesstoken" VARCHAR(2048),
    "companycode" VARCHAR(32),
    "email" VARCHAR(320),
    "expiredate" TIMESTAMP(6),
    "id" SERIAL NOT NULL,
    "isexpired" SMALLINT DEFAULT 0,
    "refreshtoken" VARCHAR(1024),
    "userrole" VARCHAR(32),
    "ipaddress" VARCHAR,
    "useragent" VARCHAR,
    "deviceid" VARCHAR,
    "userid" VARCHAR(64),

    CONSTRAINT "tbsystoken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "UserId" VARCHAR(32) NOT NULL,
    "UserName" VARCHAR(32) NOT NULL,
    "Email" VARCHAR(100) NOT NULL,
    "Password" VARCHAR(64) NOT NULL,
    "FirstName" VARCHAR(32),
    "LastName" VARCHAR(32),
    "DateOfBirth" DATE,
    "PhoneNumber" VARCHAR(20),
    "Address" VARCHAR(40),
    "Address2" VARCHAR(40),
    "Province" VARCHAR(20),
    "City" VARCHAR(20),
    "ZipCode" VARCHAR(6),
    "Avatar200x200" VARCHAR(255),
    "BaseLocale" VARCHAR(10) DEFAULT 'id-ID',
    "BaseLanguage" VARCHAR(10) DEFAULT 'id-ID',
    "IsCashier" SMALLINT DEFAULT 0,
    "IsRoot" SMALLINT DEFAULT 1,
    "UserRole" VARCHAR(20),
    "MustChangePassword" SMALLINT DEFAULT 0,
    "RootUserName" VARCHAR(32),
    "ParentUserName" VARCHAR(32),
    "IsEmailConfirmed" SMALLINT DEFAULT 0,
    "IsPhoneConfirmed" SMALLINT DEFAULT 0,
    "IsActive" SMALLINT DEFAULT 1,
    "LastVisitedURL" VARCHAR(255),
    "LastLoginTime" TIMESTAMP(6),
    "LastLogoutTime" TIMESTAMP(6),
    "MembershipId" VARCHAR(3) DEFAULT '000',
    "TermsAgrement" SMALLINT DEFAULT 1,
    "CreatedAt" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "UpdatedAt" TIMESTAMP(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("UserId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_UserName_key" ON "users"("UserName");

-- CreateIndex
CREATE UNIQUE INDEX "users_Email_key" ON "users"("Email");
