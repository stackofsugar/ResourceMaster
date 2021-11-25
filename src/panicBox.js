const electron = require("electron");
const { app, BrowserWindow, shell, ipcMain } = electron;

let mainWindowInstance;
let errorWindow;

app.once("browser-window-created", (_, firstWindow) => {
    mainWindowInstance = firstWindow;
});

function createErrorWindow(errStack = "", errType = "", errReason = "") {
    errorWindow = new BrowserWindow({
        width: 600,
        height: 400,
        title: "ERROR!",
        show: false,
        resizable: false,
        frame: false,
        backgroundColor: "#1E1E1E",
        parent: mainWindowInstance,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    errorWindow.loadFile("./src/pages/error.html");

    errorWindow.webContents.once("ready-to-show", () => {
        errorWindow.show();
        shell.beep();
        if (errStack != "") {
            errorWindow.webContents.send("errmain:payload", errStack, errType, errReason);
        }
    });

    ipcMain.on("modal:cls", () => {
        errorWindow.close();
    });
}

function panic(errObject, errType = "", errReason = "") {
    createErrorWindow(errObject.stack, errType, errReason);
}

module.exports = {
    panic: panic,
};
