# Micro Auth Service.

this project is intended in order to learn different RPC and technologies communicating.

## Getting Started

These instructions will help you get a copy of the project up and running on your local machine.

### Prerequisites

- [Node.js].
- [postgreSQL]
- [libllvm]
- [pythons]
- [nodemon]
- [other]
### Installing

1. Clone the repository:
    ```bash
    git clone https://github.com/JohnChips16/authservice/tree/main
    cd authservice
    ```

2. start the postgreSQL server:
    ```bash
    docker run --name postgres-container -e POSTGRES_PASSWORD=mysecretpassword -p 5432:5432 -d postgres
    ```

3. Verify that PostgreSQL container is running:
    ```bash
    docker ps
    ```
4. Start the service server
   ```bash
   nodemon auth.server.js
   ```

### Database Setup

1. Connect to the PostgreSQL container:
    ```bash
    docker exec -it postgres-container psql -U postgres
    ```

2. Create a new database:
    ```sql
    CREATE DATABASE your_database_name;
    ```

3. Exit the PostgreSQL shell:
    ```sql
    \q
    ```

### Configuration

Update the database connection configuration in `config.js` or your preferred configuration file:

```javascript
const config = {
  database: 'your_database_name',
  username: 'postgres',
  password: 'mysecretpassword',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
};
