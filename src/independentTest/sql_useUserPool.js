// Testing SQL conn & query using user-defined pool

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

const poolPrep = new sql.ConnectionPool(sqlServerConnConfig);
const pool = poolPrep.connect();

poolPrep.on("error", (err) => {
    console.log("Error on poolPrep: " + err);
    sql.close();
});

pool.on("error", (err) => {
    console.log("Error on poolPrep: " + err);
    sql.close();
});

async function handleMessage() {
    try {
        const request = await pool.request();
        const result = await request.query(`SELECT TOP 3 * FROM sales.orders`);
        console.log(result);
        sql.close();
        return;
    } catch (err) {
        console.log("Error on handleMessage: " + err);
        sql.close();
    }
}
