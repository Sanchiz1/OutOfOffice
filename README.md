# Out of Office

Application for managing projects and employees` leave requests.

## Database diagram:

![/images/db_diagram.jpg](https://github.com/Sanchiz1/OutOfOffice/blob/main/images/db_diagram.jpg)

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/Sanchiz1/OutOfOffice.git

2. Create SQL Server database by running db_init.sql and update connection string in **/src/api/Api/appsettings.json** 

3. Navigate to the API project directory:

   Change your current directory to the OutOfOffice project folder:
   ```sh
   cd OutOfOffice/src/api/Api
   
4. Restore the dependencies:

   Run the following command to restore the project dependencies:
   ```sh
   dotnet restore
5. Build the project:

   Use the following command to build the project:
   ```sh
   dotnet build
6. Run the API application:
   
   Finally, to run the application, execute:
   ```sh
   dotnet run --launch-profile https
7. Navigate to the Client project directory:

   Change your current directory to the CryptoView project folder:
   ```sh
   cd OutOfOffice/src/client
8. Install dependencies:
   
   ```sh
   npm i
9. Run the Client application:
   
   ```sh
   npm start
10. Log in with user:

    Email: Admin
    
    Password: admin
