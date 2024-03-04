![MiniLevelEditor logo](https://github.com/zommerfelds/MiniLevelEditor/assets/1260622/836f77d4-d812-47bd-84da-aa27372138de)

A small tile-based level editor that runs in the browser. This is useful for game jams or if you want to minimize required software installs. The goal is to run this in an online IDE e.g. Github Codespaces. The emphasis of this project is on the workflow, not necessarily on having all kinds of features.

## ⚠️ Work in progress ⚠️

[Try it now!](https://zommerfelds.github.io/MiniLevelEditor/) (serverless mode)

This tool is not implemented yet. Feel free to [open an "issue"](https://github.com/zommerfelds/MiniLevelEditor/issues/new) if you are interested in saying hello! 🙂

[Personal notes](https://docs.google.com/document/d/1PNKyq5fczIWapZl0H0cRPSAIOZsfjAB2MmLjjtfKcmM/edit#heading=h.4z0ttusyscsq)

## How to run

Run: `npm run dev`

On the browser, open `http://localhost:5173/`

## TODO list

- [x] Set up Vue project
- [x] Add a level switcher sidebar with state
- [x] Integrate with local server & save the state to disk
- [x] Nicer logo + add to README
- [x] Define a level format
- [x] Integrate Phaser in the editor
- [x] Implement basic tile paining UI (proof of concept)
- [x] Make Phaser canvas fully resizeable
- [x] Be able to configure project (tileset image(s), tile size, etc)
- [x] Tile picker
- [_] Layers (WIP, need way to add and remove layers)
- [ ] Define the auto-mapping model
- [ ] Allow to define tile properties
- [ ] Export package so it can be run with npx
- [_] Serverless mode + warning for when there is no server connected (WIP, add built-in tileset)
- [ ] Add a demo link
- [x] Make JSON output git diff friendly
- [ ] Paint multiple tiles at the same time
- [ ] More tools (e.g. eraser, move tile(s), selection)
- [ ] Undo and redo
- [ ] Support multiple tilesets
- [ ] Randomize drawing (maybe: way to define brushes)
- [ ] Add warning for old version
- [ ] Easily increase tileset size wthout messing up project
- [ ] Level reordering (try: https://vueschool.io/articles/vuejs-tutorials/how-do-i-drag-and-drop-in-vue/)
- [ ] Make a YouTube video
- [ ] Optimize saving by only sending diffs
- [ ] Fix `npm run client-type-check`

## Appendix: Notes

### How to optimize file syncing

Single diff:
https://www.npmjs.com/package/fast-json-patch

Collaborative:
https://github.com/share/sharedb
https://github.com/sueddeutsche/json-sync
