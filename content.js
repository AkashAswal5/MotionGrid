(() => {
    const EVENT_NAME = "motiongrid-docs-key";
    const menuItems = {
        copy: "Copy", cut: "Cut", paste: "Paste", undo: "Undo", redo: "Redo", find: "Find",
    };

    function injectBridge() {
        const script = document.createElement("script");
        script.src = chrome.runtime.getURL("page_script.js");
        document.documentElement.append(script);
        script.remove();
    }

    function key(keyName, modifiers = {}) {
        window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: { key: keyName, modifiers } }));
    }

    const isMac = /Mac/.test(navigator.platform || navigator.userAgent);

    function documentStart(select) {
        key(isMac ? "ArrowUp" : "Home", isMac ? { meta: true, shift: select } : { control: true, shift: select });
    }

    function documentEnd(select) {
        key(isMac ? "ArrowDown" : "End", isMac ? { meta: true, shift: select } : { control: true, shift: select });
    }

    function command(name) {
        const caption = menuItems[name];
        const editMenu = [...document.querySelectorAll(".menu-button")].find((element) => element.innerText.trim() === "Edit");
        if (!caption || !editMenu) return;
        editMenu.click();
        const item = [...document.querySelectorAll(".goog-menuitem")].find((element) => element.innerText.trim().startsWith(caption));
        item?.click();
    }

    function start() {
        const iframe = document.querySelector(".docs-texteventtarget-iframe");
        if (!iframe?.contentDocument || !window.MotionGridModal) return false;
        injectBridge();
        const controller = new window.MotionGridModal.ModalController({
            label: "DOCS",
            key,
            command,
            documentStart,
            documentEnd,
            deleteSelection() { key("Backspace"); },
            insert(after) { if (after) key("ArrowRight"); },
            openLine(above) {
                key(above ? "Home" : "End");
                key("Enter", { shift: true });
                if (above) key("ArrowUp");
            },
        });
        iframe.contentDocument.addEventListener("keydown", (event) => controller.handle(event), true);
        return true;
    }

    const timer = window.setInterval(() => { if (start()) window.clearInterval(timer); }, 250);
})();
