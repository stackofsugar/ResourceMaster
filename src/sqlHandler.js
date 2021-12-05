const electron = require("electron");
const sql = require("mssql");
const panicBox = require("./panicBox.js");

const { app, ipcMain } = electron;
const { panic } = panicBox;

let mainWindowInstance;
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

app.once("browser-window-created", (_, firstWindow) => {
    mainWindowInstance = firstWindow;
});

app.once("ready", () => {
    sql.connect(sqlServerConnConfig).catch((err) => {
        panic(err, "SQL", "An SQL connection cannot be made");
    });
});

app.once("quit", () => {
    sql.close();
});

ipcMain.on("sqlquery:send", (e, sqlQueryItem) => {
    sqlQueryGlobal = sqlQueryItem;
    console.log("Inserted SQL Query: " + sqlQueryItem);
    runSQLQuery(sqlQueryItem)
        .then((result) => {
            console.log(result);
        })
        .catch((err) => {
            panic(err, "SQL", "Specified SQL query cannot be run");
        });
});

function runSQLQuery(query) {
    return new Promise((resolve, _) => {
        sql.connect(sqlServerConnConfig)
            .then(
                (connpool) => {
                    return connpool.request().query(query);
                },
                (err) => {
                    panic(err, "SQL", "An SQL connection cannot be made (Promise rejected)");
                }
            )
            .then(
                (result) => {
                    resolve(result);
                },
                (err) => {
                    panic(err, "SQL", "An SQL Query request is rejected");
                }
            )
            .catch((err) => {
                panic(err, "SQL", "SQL run error");
            });
    });
}

sql.on("error", (err) => {
    panic(err, "SQL", "Global SQL Error");
});

module.exports = {
    runSQLQuery: runSQLQuery,
};
