const electron = require("electron");
const sql = require("mssql");

const { app, ipcMain } = electron;

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

ipcMain.on("ipctest:send", (e, payload) => {
    console.log("From ipcmain invocation on sqlHandler.js: " + payload);
    mainWindowInstance.blur();
});

app.once("ready", () => {
    sql.connect(sqlServerConnConfig).catch((err) => {
        console.log(err);
    });
});

app.once("quit", () => {
    sql.close();
});

ipcMain.on("sqlquery:send", (e, sqlQueryItem) => {
    sqlQueryGlobal = sqlQueryItem;
    console.log("Inserted SQL Query: " + sqlQueryItem);
    if (sqlQueryItem == "sus") {
        panicBox();
    } else {
        runSQLQuery(sqlQueryItem)
            .then((result) => {
                console.log(result);
            })
            .catch((err) => {
                console.log("Thrown on IPC endpoint: " + err);
            });
    }
});

function runSQLQuery(query) {
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
                }
            )
            .then(
                (result) => {
                    resolve(result);
                },
                (err) => {
                    console.log("SQL Server request rejected! Errcode: " + err);
                }
            )
            .catch((err) => {
                console.log("Thrown in runSQLQuery: " + err.msg);
            });
    });
}

sql.on("error", (err) => {
    console.log("Thrown by global SQL driver: " + err);
});
