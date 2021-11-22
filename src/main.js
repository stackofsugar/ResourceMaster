/* << ResourceMaster >>
 * (c) Christopher Digno 2021
 * Deskripsi: Sebuah database system sumber daya alam
 *   berbasis Electronjs dan Node.js, dibuat sebagai
 *   implementasi final project DBMS
 * Pengembang: Christopher Digno
 * Lisensi: MIT
 */

const electron = require("electron");
const pb = require("./panicBox.js");
require("./sqlHandler.js");

const { app, BrowserWindow, Menu, ipcMain, shell } = electron;
const { panicBox } = pb;

let mainWindow;
let errorWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        show: false,
        frame: false,
        backgroundColor: "#1E1E1E",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("./src/pages/front.html");

    mainWindow.once("closed", () => {
        mainWindow = null;
        app.quit();
    });

    mainWindow.webContents.once("ready-to-show", () => {
        mainWindow.maximize();
        mainWindow.show();
        const bounds = mainWindow.webContents.getOwnerBrowserWindow().getBounds();
        console.log(bounds);
    });
});

///////////////////////// testing zone /////////////////////////////////////////
