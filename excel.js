(() => {
    const EVENT_NAME = "motiongrid-excel-key";
    function key(keyName, modifiers = {}) {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key: keyName, modifiers } }));
    }

    const isMac = /Mac/.test(navigator.platform || navigator.userAgent);
    const primary = isMac ? "metaKey" : "ctrlKey";
    const documentStart = (select) => key(isMac ? "ArrowUp" : "Home", isMac ? { metaKey: true, shiftKey: select } : { ctrlKey: true, shiftKey: select });
    const documentEnd = (select) => key(isMac ? "ArrowDown" : "End", isMac ? { metaKey: true, shiftKey: select } : { ctrlKey: true, shiftKey: select });
    const wordForward = (select) => key("ArrowRight", isMac ? { altKey: true, shiftKey: select } : { ctrlKey: true, shiftKey: select });
    const wordBackward = (select) => key("ArrowLeft", isMac ? { altKey: true, shiftKey: select } : { ctrlKey: true, shiftKey: select });
    const afterSelection = (action) => window.setTimeout(action, 100);
    const selectLine = (action) => {
        key("Home");
        window.setTimeout(() => {
            key("End", { shiftKey: true });
            window.setTimeout(action, 100);
        }, 100);
    };
    const undo = () => key("z", { [primary]: true });
    const controller = new window.MotionGridModal.ModalController({
        label: "EXCEL",
        key,
        documentStart,
        documentEnd,
        wordForward,
        wordBackward,
        undo,
        findNext(backward) {
            key("f", { [primary]: true });
            window.setTimeout(() => key("Enter", { shiftKey: backward }), 350);
        },
        afterSelection,
        selectLine,
        deleteSelection() { key("Delete"); },
        command(name) {
            const shortcut = { copy: "c", cut: "x", paste: "v", undo: "z", redo: "y", find: "f" }[name];
            if (shortcut) key(shortcut, { [primary]: true });
        },
        insert() {
            key("F2");
        },
        openLine(above) {
            const insertRow = () => key("+", { [primary]: true, shiftKey: true });
            if (above) {
                key(" ", { shiftKey: true });
                window.setTimeout(insertRow, 100);
            } else {
                key("ArrowDown");
                window.setTimeout(() => {
                    key(" ", { shiftKey: true });
                    window.setTimeout(insertRow, 100);
                }, 100);
            }
        },
        lineOperation(operation) {
            key(" ", { shiftKey: true });
            window.setTimeout(() => {
                if (operation === "d") key("-", { [primary]: true });
                else if (operation === "y") key("c", { [primary]: true });
                else if (operation === "c") key("Delete");
            }, 100);
        },
        rowInsert: true,
    });
    document.addEventListener("keydown", (event) => controller.handle(event), true);
})();
