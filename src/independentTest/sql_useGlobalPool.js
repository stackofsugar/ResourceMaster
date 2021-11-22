// Testing SQL conn & query using global pool and promise

const sql = require("mssql");

const sqlServerConnConfig = {
    server: "localhost",
    port: 1433,
    user: "ResourceMasterApp",
    password: "ResourceMaster1234567890",
    database: "BikeStore",
    connectionTimeout: 5000,
    options: {
        encrypt: false,
    },
};

runSimpleSqlQueryWithPromises("SELECT TOP 3 * FROM sales.orders")
    .then((result) => {
        console.log(result);
        sql.close();
    })
    .catch((err) => {
        console.log(err);
        sql.close();
    });

function runSimpleSqlQueryWithPromises(query) {
    return new Promise((resolve, _) => {
        sql.connect(sqlServerConnConfig)
            .then(
                (connpool) => {
                    return connpool.request().query(query);
                },
                (err) => {
                    console.log(
                        "SQL Server connection rejected! Errcode: " + err
                    );
                    sql.close();
                }
            )
            .then(
                (result) => {
                    resolve(result);
                },
                (err) => {
                    console.log("SQL Server request rejected! Errcode: " + err);
                    sql.close();
                }
            )
            .catch((err) => {
                console.log(
                    "Thrown in runSimpleSqlQueryWithPromises: " + err.msg
                );
                sql.close();
            });
    });
}
