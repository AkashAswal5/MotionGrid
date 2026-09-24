(() => {
    const isMac = /Mac/.test(navigator.platform || navigator.userAgent);
    const primary = isMac ? "meta" : "control";

    class ModalController {
        constructor(adapter) {
            this.adapter = adapter;
            this.mode = "normal";
            this.count = "";
            this.operation = "";
            this.pendingGo = false;
            this.findMode = false;
            this.temporaryNormal = false;
            this.indicator = this.createIndicator();
            this.render();
        }

        createIndicator() {
            const indicator = document.createElement("div");
            indicator.className = "motiongrid-indicator";
            indicator.style.cssText = "position:fixed;right:18px;bottom:18px;z-index:2147483647;border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:6px 9px;background:#18212b;color:#f8fafc;font:700 11px ui-monospace,SFMono-Regular,Menlo,monospace;letter-spacing:.08em;pointer-events:none";
            document.documentElement.append(indicator);
            return indicator;
        }

        render() {
            const state = this.findMode ? "FIND" : this.mode.toUpperCase();
            this.indicator.textContent = `${this.adapter.label} / ${state}`;
            this.indicator.style.background = this.findMode ? "#315b8f" : this.mode === "insert" ? "#176b52" : this.mode === "visual" ? "#8a5a13" : "#18212b";
        }

        setMode(mode) {
            this.mode = mode;
            this.count = "";
            this.operation = "";
            this.pendingGo = false;
            this.findMode = false;
            this.render();
        }

        repeat(action) {
            const count = Number(this.count || 1);
            this.count = "";
            for (let index = 0; index < count; index += 1) action();
        }

        motion(key, selection = false) {
            const select = selection || this.mode === "visual";
            const move = (direction, modifiers = {}) => this.repeat(() => this.adapter.key(direction, { ...modifiers, shift: select }));
            switch (key) {
                case "h": move("ArrowLeft"); break;
                case "j": move("ArrowDown"); break;
                case "k": move("ArrowUp"); break;
                case "l": move("ArrowRight"); break;
                case "w": this.repeat(() => this.adapter.wordForward(select)); break;
                case "b": this.repeat(() => this.adapter.wordBackward(select)); break;
                case "e": this.repeat(() => this.adapter.wordForward(select)); break;
                case "0": case "^": case "_": move("Home"); break;
                case "$": move("End"); break;
                case "G": this.adapter.documentEnd(select); break;
                case "{": move("ArrowUp", { [primary]: true }); break;
                case "}": move("ArrowDown", { [primary]: true }); break;
                default: return false;
            }
            return true;
        }

        applyOperation(key) {
            const operation = this.operation;
            this.operation = "";
            if (key === operation) {
                this.adapter.selectLine(() => this.runOperation(operation));
                return;
            } else if (key === "g") {
                this.pendingGo = true;
                this.operation = operation;
                return;
            } else if (!this.motion(key, true)) {
                this.setMode("normal");
                return;
            }
            this.afterSelection(() => this.runOperation(operation));
        }

        runOperation(operation) {
            this.adapter.command(operation === "d" || operation === "c" ? "cut" : "copy");
            if (operation === "c") this.enterInsert();
            else this.setMode("normal");
        }

        afterSelection(action) {
            this.adapter.afterSelection(action);
        }

        goToDocumentStart(select = false) {
            this.adapter.documentStart(select);
        }

        enterInsert(after = false) {
            this.adapter.insert(after);
            this.setMode("insert");
        }

        handleNormal(key) {
            if (/^[1-9]$/.test(key)) {
                this.count += key;
                return;
            }
            if (this.pendingGo) {
                this.pendingGo = false;
                if (key === "g") {
                    this.goToDocumentStart(!!this.operation);
                    if (this.operation) {
                        const operation = this.operation;
                        this.operation = "";
                        this.afterSelection(() => this.runOperation(operation));
                    }
                } else {
                    this.operation = "";
                }
                return;
            }
            if (this.operation) {
                this.applyOperation(key);
                return;
            }
            if (this.motion(key)) return;
            switch (key) {
                case "g": this.pendingGo = true; this.render(); break;
                case "i": this.enterInsert(); break;
                case "a": this.enterInsert(true); break;
                case "I": this.adapter.key("Home"); this.enterInsert(); break;
                case "A": this.adapter.key("End"); this.enterInsert(); break;
                case "o": this.adapter.openLine(false); this.setMode("insert"); break;
                case "O": this.adapter.openLine(true); this.setMode("insert"); break;
                case "v": this.setMode("visual"); this.adapter.key("ArrowRight", { shift: true }); break;
                case "V": this.adapter.selectLine(() => this.setMode("visual")); break;
                case "d": case "c": case "y": this.operation = key; break;
                case "D":
                    this.adapter.key("End", { shift: true });
                    this.afterSelection(() => this.adapter.deleteSelection());
                    break;
                case "R":
                    this.adapter.selectLine(() => this.adapter.deleteSelection());
                    break;
                case "Y":
                    this.adapter.selectLine(() => this.adapter.command("copy"));
                    break;
                case "p": case "P": this.adapter.command("paste"); break;
                case "x": this.adapter.key("Delete"); break;
                case "s": this.adapter.key("Delete"); this.enterInsert(); break;
                case "J": this.adapter.key("End"); this.adapter.key("Delete"); break;
                case "u": this.adapter.undo(); break;
                case "r": this.adapter.command("redo"); break;
                case "/": this.adapter.command("find"); break;
            }
        }

        handleVisual(key) {
            if (this.motion(key, true)) return;
            switch (key) {
                case "d": case "D": this.afterSelection(() => { this.adapter.command("cut"); this.setMode("normal"); }); break;
                case "c": this.afterSelection(() => { this.adapter.command("cut"); this.enterInsert(); }); break;
                case "y": this.afterSelection(() => { this.adapter.command("copy"); this.setMode("normal"); }); break;
                case "p": case "P": this.adapter.command("paste"); this.setMode("normal"); break;
            }
        }

        handle(event) {
            // Events generated by the page bridge must reach the editor untouched.
            if (!event.isTrusted) return;
            if (event.defaultPrevented || event.altKey || event.metaKey || (event.ctrlKey && event.key.toLowerCase() !== "o")) return;
            if (event.key === "Escape") {
                if (this.findMode) {
                    this.findMode = false;
                    this.render();
                    return;
                }
                if (this.mode !== "insert") event.preventDefault();
                this.setMode("normal");
                return;
            }
            if (this.findMode) return;
            if (this.mode === "insert") {
                if (event.ctrlKey && event.key.toLowerCase() === "o") {
                    event.preventDefault();
                    this.temporaryNormal = true;
                    this.setMode("normal");
                }
                return;
            }
            if (event.ctrlKey || event.key.length !== 1) return;
            event.preventDefault();
            event.stopImmediatePropagation();
            if (this.mode === "visual") this.handleVisual(event.key);
            else this.handleNormal(event.key);
            if (this.temporaryNormal && this.mode === "normal") {
                this.temporaryNormal = false;
                this.enterInsert();
            }
        }
    }

    window.MotionGridModal = { ModalController, isMac, primary };
})();
