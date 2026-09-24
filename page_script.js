(() => {
    const keyCodes = { Backspace: 8, Enter: 13, Escape: 27, End: 35, Home: 36, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Delete: 46, F2: 113 };
    window.addEventListener("motiongrid-docs-key", (event) => {
        const { key, modifiers } = event.detail;
        const editorDocument = document.querySelector(".docs-texteventtarget-iframe")?.contentDocument;
        const target = editorDocument?.activeElement && editorDocument.activeElement !== editorDocument.body
            ? editorDocument.activeElement
            : editorDocument?.querySelector("textarea, [contenteditable='true']");
        if (!target) return;
        const keyboardModifiers = {
            shiftKey: !!modifiers.shift,
            ctrlKey: !!modifiers.control,
            altKey: !!modifiers.alt,
            metaKey: !!modifiers.meta,
        };
        for (const type of ["keydown", "keyup"]) {
            const keyboardEvent = new KeyboardEvent(type, { key, bubbles: true, cancelable: true, ...keyboardModifiers });
            Object.defineProperty(keyboardEvent, "keyCode", { get: () => keyCodes[key] || 0 });
            Object.defineProperty(keyboardEvent, "which", { get: () => keyCodes[key] || 0 });
            target.dispatchEvent(keyboardEvent);
        }
    });
})();
