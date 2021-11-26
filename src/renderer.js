const electron = require("electron");
const { ipcRenderer } = electron;

$(() => {
    // Window controls (minimize, window, close)
    $("#winmin").on("click", (e) => {
        e.preventDefault();
        ipcRenderer.send("win:min");
    });
    $("#winwdw").on("click", (e) => {
        e.preventDefault();
        ipcRenderer.send("win:wdw");
    });
    $("#wincls").on("click", (e) => {
        e.preventDefault();
        ipcRenderer.send("win:cls");
    });

    // Sidenav
    $(".sidenav").sidenav();

    // Testing
    $("#winsize-test").on("click", (e) => {
        e.preventDefault();
        ipcRenderer.send("win:err-test");
    });
});
