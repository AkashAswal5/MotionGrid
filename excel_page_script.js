(() => {
    window.addEventListener("motiongrid-excel-key", (event) => {
        const { key, modifiers } = event.detail;
        const target = document.activeElement || document.body;
        const keyboardModifiers = {
            shiftKey: !!(modifiers.shift || modifiers.shiftKey),
            ctrlKey: !!(modifiers.control || modifiers.ctrlKey),
            altKey: !!(modifiers.alt || modifiers.altKey),
            metaKey: !!(modifiers.meta || modifiers.metaKey),
        };
        for (const type of ["keydown", "keyup"]) {
            target.dispatchEvent(new KeyboardEvent(type, { key, code: key, bubbles: true, cancelable: true, ...keyboardModifiers }));
        }
    });
})();
