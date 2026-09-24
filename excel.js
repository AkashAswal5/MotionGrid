(() => {
    const EVENT_NAME = "motiongrid-excel-key";
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("excel_page_script.js");
    document.documentElement.append(script);
    script.remove();

    function key(keyName, modifiers = {}) {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key: keyName, modifiers } }));
    }

    const isMac = /Mac/.test(navigator.platform || navigator.userAgent);
    const primary = isMac ? "metaKey" : "ctrlKey";
    const documentStart = (select) => key(isMac ? "ArrowUp" : "Home", isMac ? { metaKey: true, shiftKey: select } : { ctrlKey: true, shiftKey: select });
    const documentEnd = (select) => key(isMac ? "ArrowDown" : "End", isMac ? { metaKey: true, shiftKey: select } : { ctrlKey: true, shiftKey: select });
    const controller = new window.MotionGridModal.ModalController({
        label: "EXCEL",
        key,
        documentStart,
        documentEnd,
        deleteSelection() { key("Delete"); },
        command(name) {
            const shortcut = { copy: "c", cut: "x", paste: "v", undo: "z", redo: "y", find: "f" }[name];
            if (shortcut) key(shortcut, { [primary]: true });
        },
        insert(after) {
            if (after) key("End");
            key("F2");
        },
        openLine(above) {
            key("End");
            key("Enter", { shiftKey: above });
        },
    });
    document.addEventListener("keydown", (event) => controller.handle(event), true);
})();
