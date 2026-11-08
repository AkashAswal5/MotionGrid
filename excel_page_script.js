(() => {
    const keyCodes = { Backspace: 8, Enter: 13, Escape: 27, PageUp: 33, PageDown: 34, End: 35, Home: 36, ArrowLeft: 37, ArrowUp: 38, ArrowRight: 39, ArrowDown: 40, Delete: 46, F2: 113 };
    const keyCode = (key) => keyCodes[key] || (key.length === 1 ? key.toUpperCase().charCodeAt(0) : 0);

    window.addEventListener("motiongrid-excel-key", (event) => {
        const { key, modifiers } = event.detail;
        const target = document.activeElement || document.body;
        const keyboardModifiers = {
            shiftKey: !!(modifiers.shift || modifiers.shiftKey),
            ctrlKey: !!(modifiers.control || modifiers.ctrlKey),
            altKey: !!(modifiers.alt || modifiers.altKey),
            metaKey: !!(modifiers.meta || modifiers.metaKey),
        };
        const code = keyCode(key);
        for (const type of ["keydown", "keyup"]) {
            const keyboardEvent = new KeyboardEvent(type, { key, code: key, bubbles: true, cancelable: true, ...keyboardModifiers });
            Object.defineProperties(keyboardEvent, {
                keyCode: { get: () => code },
                which: { get: () => code },
            });
            target.dispatchEvent(keyboardEvent);
        }
    });
})();
