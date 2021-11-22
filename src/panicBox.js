const electron = require("electron");
const { app, BrowserWindow, shell } = electron;

let mainWindowInstance;

app.once("browser-window-created", (_, firstWindow) => {
    mainWindowInstance = firstWindow;
});

function createChildishWindow(windowObject, HTMLFile) {
    windowObject = new BrowserWindow({
        width: 400,
        height: 200,
        title: "ERROR!",
        show: false,
        resizable: false,
        parent: mainWindowInstance,
        modal: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
    });

    windowObject.loadFile(HTMLFile);

    windowObject.webContents.once("ready-to-show", () => {
        windowObject.show();
        shell.beep();
    });

    windowObject.on("close", () => {
        windowObject = null;
    });
}

function panicBox(windowObject) {
    createChildishWindow(windowObject, "./src/pages/error.html");
}

module.exports = {
    panicBox: panicBox,
};
