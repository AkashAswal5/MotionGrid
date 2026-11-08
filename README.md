# MotionGrid

Modal, Neovim-style editing for **Google Docs** and **Excel for the web**, delivered as a local Chrome extension.

MotionGrid brings familiar modal editing keybindings to browser-based editors by translating Vim commands into each editor's native keyboard behavior. It does not use document APIs, inject content into the page, or transmit any document data — every command is dispatched as a local, native editor event.

## Features

- Modal editing with Normal, Insert, and Visual modes, plus an on-screen mode indicator
- Core Vim motions and operators with count support (`5j`, `3w`, `2dd`)
- Editor-specific adapters for Google Docs and Excel for the web
- Zero-footprint by design: no background service worker, no network requests, no analytics, no storage, no document API access

## Supported Editors

| Editor | Hosts |
| --- | --- |
| Google Docs | `docs.google.com` |
| Excel for the web | `office.com`, `officeapps.live.com`, `excel.cloud.microsoft` |

> Disable other keyboard-navigation extensions on these sites to avoid keybinding conflicts.

## Keybindings

### Motions

| Key | Action |
| --- | --- |
| `h` `j` `k` `l` | Left, down, up, right |
| `w` `e` | Forward one word or cell boundary |
| `b` | Back one word or cell boundary |
| `{` `}` | Previous / next paragraph or cell region |
| `0` `^` `_` | Start of line or active cell range |
| `$` | End of line or active cell range |
| `gg` | Document or worksheet start |
| `G` | Document or worksheet end |
| `Ctrl+d` / `Ctrl+u` | Scroll half a page down / up |
| `{n}` + motion | Repeat a motion (e.g. `5j`) |

### Modes

| Key | Action |
| --- | --- |
| `i` / `a` | Insert at cursor / after cursor |
| `I` / `A` | Insert at start / end of line |
| `v` / `V` | Character-wise / line-wise visual selection |
| `Esc` / `Ctrl+[` | Return to normal mode |
| `jk` / `jj` | Return to normal mode from insert (the first `j` is removed automatically) |
| `Ctrl+o` | Execute one normal-mode command from insert mode |

### Operators and Editing

| Key | Action |
| --- | --- |
| `d` + motion | Delete (cut) through a motion, including `dd` |
| `c` + motion | Change through a motion, entering insert mode |
| `y` + motion | Yank (copy) through a motion, including `yy` |
| `D` / `Y` | Delete / yank from cursor to end of line or range |
| `C` / `S` | Change to end of line / change the whole line |
| `X` | Delete backward |
| `Ctrl+r` | Redo |
| `>>` / `<<` | Indent / outdent the current line (Google Docs only) |
| `p` / `P` | Paste |
| `x` | Delete forward |
| `s` | Delete forward and insert |
| `u` / `r` | Undo / redo |
| `o` / `O` | Open a new line below / above |
| `J` | Join with the next line, where supported |
| `/` | Search the document or workbook with the editor's native Find |
| `n` / `N` | Repeat the last search forward / backward via native Find |

### Behavior Notes

- Yank and paste operate on the **system clipboard**; named and numbered registers are not implemented.
- In Excel, `i` / `a` enters cell-edit mode (F2) with the cursor at the end of the cell contents.
- In Excel, line-wise commands operate on entire rows: `dd` deletes the row, `yy` / `Y` copy it, `cc` / `S` clear its contents, and `o` / `O` insert a blank row below / above and return to normal mode.
- `n` / `N` reopen the editor's native Find dialog and jump to the next (or previous) match. In Google Docs, `N` may behave like `n` if the dialog does not accept a reversed-direction Enter.
- The mode indicator shows any pending sequence — counts, operators, and `g` — so an in-progress command such as `3dg` is always visible.

## Installation

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Choose this extension folder.
5. Reload any open Google Docs or Excel for the web tabs.

## Privacy

MotionGrid is designed to be privacy-preserving:

- No background service worker
- No network requests of any kind
- No analytics or telemetry
- No storage of browsing activity or document content
- No Google Docs or Office document API access
- Runs only on the declared Docs and Excel hosts above, observing keyboard events to implement mappings and dispatching corresponding native editor events locally

## Limitations

- Advanced Neovim features — registers, macros, marks, custom mappings, Ex commands (`:`), and line-local character motions such as `f{char}` — are not implemented. Google Docs and Excel for the web do not expose the active-line text and cursor positions required for reliable character-level motion.
- Google and Microsoft may change their editors' internal behavior, which can affect synthetic keyboard events. If a binding stops working, reload the tab first.

## License

Released under the MIT License. See [MIT-LICENSE.txt](MIT-LICENSE.txt).
