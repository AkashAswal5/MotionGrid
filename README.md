# MotionGrid

MotionGrid is a local Chrome extension for modal, Neovim-style editing in Google Docs and Excel for the web. It translates commands to each editor's native keyboard behavior; it does not use document APIs or transmit document data.

Disable other keyboard-navigation extensions on these sites to prevent keybinding conflicts.

## Supported Editors

- Google Docs: `https://docs.google.com/*`
- Excel for the web: `office.com`, `officeapps.live.com`, and `excel.cloud.microsoft`

## Keybindings

### Navigation

- `h`, `j`, `k`, `l` - Left, down, up, right
- `w`, `e`, `f` - Move forward one word or cell boundary
- `b` - Move back one word or cell boundary
- `e` - Move to the next word or cell boundary
- `{`, `}` - Previous/next paragraph or cell region
- `0`, `^`, `_` - Start of line or active cell range
- `$` - End of line or active cell range
- `gg`, `G` - Document or worksheet start/end
- `{n}` + motion - Repeat a motion, such as `5j`

### Modes

- `i`, `a` - Insert at cursor or after cursor
- `I`, `A` - Insert at start or end
- `v`, `V` - Character-wise or line-wise visual selection
- `Esc` - Return to normal mode
- `Ctrl+o` - One normal-mode command from insert mode

### Editing

- `d`, `c`, `y` + motion - Delete/cut, change, or copy through a motion, including `dw`, `db`, `dd`, and `yy`
- `D`, `Y` - Delete or copy from the cursor to line/range end
- `p`, `P` - Paste
- `x` - Delete forward
- `s` - Delete forward and insert
- `u`, `r` - Undo and redo
- `o`, `O` - New line below or above
- `J` - Join with the next line when supported by the editor
- `/` - Open Find

## Installation

1. Open `chrome://extensions` in Chrome.
2. Enable **Developer mode**.
3. Select **Load unpacked**.
4. Select this extension folder.
5. Reload any open Docs or Excel web tabs.

## Privacy

MotionGrid has no background service, network requests, analytics, storage, or document API access. It runs only on declared Google Docs and Excel web hosts, observes keyboard events to implement mappings, and dispatches corresponding native editor events locally.

## Limitations

- Advanced Neovim features such as registers, macros, marks, and custom mappings are not implemented.
- Google Docs and Excel may change their internal editor behavior, which can affect synthetic keyboard events.

## License

See [MIT-LICENSE.txt](MIT-LICENSE.txt).
