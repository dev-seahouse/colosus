# Steps to generate migration folder and sql file

1. Run the following command by replacing [details of database changes] with what you are trying to achieve in your migration script.
    ```
    yarn prisma migrate dev --schema libs/@bambu/server-core/db/central-db/src/prisma/schema.prisma --create-only --name [details of database changes]
    ```
2. eg. yarn prisma migrate dev --schema libs/@bambu/server-core/db/central-db/src/prisma/schema.prisma --create-only --name AddTransactionInterestColumn
3. After running the script, a new folder "20231025090204_add_transact_interest_column" and the migration sql file(migration.sql) will be generated.
4. Click on migration.sql and check if the script generated is correct for your use case. Take note on table or column deletion and think of the impact to your production database, and make necessary changes to the migration script if needed.
5. Add in necessary comment wherever needed.
6. Run the following command to trigger the script in migration.sql to perform the database migration.
    ```
    yarn prisma migrate dev --schema libs/@bambu/server-core/db/central-db/src/prisma/schema.prisma
    ```
   
# Folder naming convention (used for manually creating migration folder)

Prisma ORM, an open-source database toolkit, uses a specific naming convention for its migration folders when managing database schema changes through migrations. The convention is as follows:

1. **Folder Name Structure**: The migration folders are typically named with a timestamp prefix, followed by a descriptive name of your choice. The structure is usually `YYYYMMDDHHMMSS_descriptive_name`, where:
   - `YYYY` is the 4-digit year.
   - `MM` is the 2-digit month.
   - `DD` is the 2-digit day.
   - `HH` is the 2-digit hour.
   - `MM` is the 2-digit minute.
   - `SS` is the 2-digit second.
2. **Timestamp**: The timestamp reflects the exact time the migration was created. This helps in maintaining a chronological order of migrations.
3. **Descriptive Name**: After the timestamp, a descriptive name is added. This part of the name should briefly describe the purpose or main action of the migration, like `add_users_table` or `remove_old_columns`.
4. **Automated Naming**: When you create a new migration using Prisma's CLI with a command like `prisma migrate dev --name add_users_table`, Prisma automatically prepends the current timestamp to the name you provide.
5. **Purpose of Naming Convention**: This naming convention helps in organizing migrations chronologically and makes it easier to understand the purpose of each migration at a glance. It's crucial for maintaining a clear history of database schema changes over time. Remember, while Prisma provides a default naming structure, the descriptive part of the name is flexible and should be chosen to best describe the migration's intent.
