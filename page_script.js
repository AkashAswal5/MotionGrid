(() => {
    const keyCodes = { Backspace: 8, Enter: 13, Escape: 27, End: 35, Home: 36, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Delete: 46, F2: 113 };

    function keyCode(key) {
        return keyCodes[key] || (key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0);
    }

    function dispatchKey(type, target, key, modifiers) {
        const code = keyCode(key);
        const event = document.createEvent("KeyboardEvent");
        event.initKeyboardEvent(
            type,
            true,
            true,
            window,
            "",
            false,
            !!modifiers.control,
            !!modifiers.alt,
            !!modifiers.shift,
            !!modifiers.meta,
            code,
            code,
        );
        Object.defineProperties(event, {
            keyCode: { get: () => code },
            which: { get: () => code },
            ctrlKey: { get: () => !!modifiers.control },
            altKey: { get: () => !!modifiers.alt },
            shiftKey: { get: () => !!modifiers.shift },
            metaKey: { get: () => !!modifiers.meta },
        });
        target.dispatchEvent(event);
    }

    window.addEventListener("motiongrid-docs-key", (event) => {
        const { key, modifiers } = event.detail;
        const editorDocument = document.querySelector(".docs-texteventtarget-iframe")?.contentDocument;
        const target = editorDocument?.querySelector("textarea") || editorDocument?.activeElement;
        if (!target) return;
        dispatchKey("keydown", target, key, modifiers);
        dispatchKey("keyup", target, key, modifiers);
    });
})();
