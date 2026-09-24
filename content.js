(() => {
    const EVENT_NAME = "motiongrid-docs-key";
    const menuItems = {
        copy: "Copy", cut: "Cut", paste: "Paste", undo: "Undo", redo: "Redo", find: "Find",
    };

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

    function wordForward(select) {
        key("ArrowRight", isMac ? { alt: true, shift: select } : { control: true, shift: select });
    }

    function wordBackward(select) {
        key("ArrowLeft", isMac ? { alt: true, shift: select } : { control: true, shift: select });
    }

    function undo() {
        key("z", isMac ? { meta: true } : { control: true });
    }

    function command(name) {
        const caption = menuItems[name];
        const editMenu = [...document.querySelectorAll(".menu-button")].find((element) => element.innerText.trim() === "Edit");
        if (!caption || !editMenu) return;
        editMenu.click();
        const item = [...document.querySelectorAll(".goog-menuitem")].find((element) => element.innerText.trim().startsWith(caption));
        item?.click();
    }

    function findCharacter(character) {
        command("find");
        window.setTimeout(() => {
            const input = document.querySelector("[role='dialog'] input, .docs-findbar input");
            if (!input) return;
            input.focus();
            input.value = character;
            input.dispatchEvent(new InputEvent("input", { bubbles: true, inputType: "insertText", data: character }));
            input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
        }, 150);
    }

    function afterSelection(action) {
        window.setTimeout(action, 100);
    }

    function selectLine(action) {
        key("Home");
        window.setTimeout(() => {
            key("End", { shift: true });
            window.setTimeout(action, 100);
        }, 100);
    }

    function start() {
        const iframe = document.querySelector(".docs-texteventtarget-iframe");
        if (!iframe?.contentDocument || !window.MotionGridModal) return false;
        const controller = new window.MotionGridModal.ModalController({
            label: "DOCS",
            key,
            command,
            findCharacter,
            documentStart,
            documentEnd,
            wordForward,
            wordBackward,
            undo,
            afterSelection,
            selectLine,
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
