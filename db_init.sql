CREATE DATABASE OutOfOfficeDB;

GO

USE OutOfOfficeDB;

CREATE TABLE Positions (
    Id INT PRIMARY KEY IDENTITY(1, 1),
    Name NVARCHAR(Max) NOT NULL
);

CREATE TABLE Employees (
    Id INT PRIMARY KEY IDENTITY(1, 1),
    FullName NVARCHAR(MAX) NOT NULL,
    Email NVARCHAR(255) NOT NULL,
    PositionId INT FOREIGN KEY REFERENCES Positions(Id) NOT NULL,
    Subdivision NVARCHAR(Max) NOT NULL,
    Status NVARCHAR(50) NOT NULL,
    PeoplePartner INT FOREIGN KEY REFERENCES Employees(Id),
    OutOfOfficeBalance INT NOT NULL,
    Password NVARCHAR(128) NOT NULL
);

CREATE TABLE LeaveRequests (
    Id INT PRIMARY KEY IDENTITY(1, 1),
    EmployeeId INT FOREIGN KEY REFERENCES Employees(Id) NOT NULL,
    AbsenceReason NVARCHAR(Max) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE NOT NULL,
    Comment NVARCHAR(MAX),
    Status NVARCHAR(50) NOT NULL DEFAULT 'New'
);

CREATE TABLE ApprovalRequests (
    Id INT PRIMARY KEY IDENTITY,
    ApproverId INT FOREIGN KEY REFERENCES Employees(Id),
    LeaveRequestId INT FOREIGN KEY REFERENCES LeaveRequests(Id),
    Status NVARCHAR(50) NOT NULL DEFAULT 'New',
    Comment NVARCHAR(MAX)
);

CREATE TABLE Projects (
    ID INT PRIMARY KEY IDENTITY(1, 1),
    ProjectType NVARCHAR(MAX) NOT NULL,
    StartDate DATE NOT NULL,
    EndDate DATE,
    ProjectManagerId INT FOREIGN KEY REFERENCES Employees(Id),
    Comment NVARCHAR(MAX),
    Status NVARCHAR(50) NOT NULL
);