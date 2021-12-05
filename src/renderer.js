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

    // SQL Query
    $("#query-submit").on("click", (e) => {
        e.preventDefault();
        query_text = $("#query-textarea").val();
        ipcRenderer.send("sql:request", query_text);
    });

    $("#query-delete").on("click", (e) => {
        e.preventDefault();
        $("#query-textarea").val("");
    });

    // Titlebar Dropdown
    var is_any_titlebar_open = false;

    $(".dropdown-trigger").dropdown({
        coverTrigger: false,
        onOpenStart: () => {
            is_any_titlebar_open = true;
        },
        onCloseStart: () => {
            is_any_titlebar_open = false;
        },
    });

    $("#exit-dropdown").on("click", (e) => {
        e.preventDefault();
        ipcRenderer.send("win:cls");
    });

    $("#test-error-dropdown").on("click", (e) => {
        e.preventDefault();
        ipcRenderer.send("win:err-test");
    });
});
