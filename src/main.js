/* << ResourceMaster >>
 * (c) Christopher Digno 2021
 * Deskripsi: Sebuah database system sumber daya alam
 *   berbasis Electronjs dan Node.js, dibuat sebagai
 *   implementasi final project DBMS
 * Pengembang: Christopher Digno
 * Lisensi: MIT
 */

const electron = require("electron");
const { type } = require("jquery");
const panicBox = require("./panicBox.js");
require("./sqlHandler.js");

const { app, BrowserWindow, Menu, ipcMain, shell } = electron;
const { panic } = panicBox;

let mainWindow;
let errorWindow;

// Main app process
app.on("ready", () => {
    mainWindow = new BrowserWindow({
        show: false,
        frame: false,
        backgroundColor: "#1E1E1E",
        minWidth: 950,
        minHeight: 620,
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
    });
});

// Handle window control buttons
ipcMain.on("win:cls", () => {
    mainWindow.close();
});
ipcMain.on("win:wdw", () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});
ipcMain.on("win:min", () => {
    mainWindow.minimize();
});

ipcMain.on("win:err-test", () => {
    try {
        let testUndefinedFunction = null;
        testUndefinedFunction.on("close", () => {});
    } catch (err) {
        panic(err, "Test", "Uh-oh, you might have something here...");
    }
});
