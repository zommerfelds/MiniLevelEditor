![MiniLevelEditor logo](https://github.com/zommerfelds/MiniLevelEditor/assets/1260622/836f77d4-d812-47bd-84da-aa27372138de)

A small tile-based level editor that runs in the browser. This is useful for game jams or if you want to minimize required software installs. The goal is to run this in an online IDE e.g. Github Codespaces. The emphasis of this project is on the workflow, not necessarily on having all kinds of features.

## ⚠️ Work in progress ⚠️

[Try it now!](https://zommerfelds.github.io/MiniLevelEditor/) (serverless mode)

This tool is not implemented yet. Feel free to [open an "issue"](https://github.com/zommerfelds/MiniLevelEditor/issues/new) if you are interested in saying hello! 🙂

[Personal notes](https://docs.google.com/document/d/1PNKyq5fczIWapZl0H0cRPSAIOZsfjAB2MmLjjtfKcmM/edit#heading=h.4z0ttusyscsq)

## Using in a project

`npx zommerfelds/MiniLevelEditor@latest`

Note: this will build the entire package and may take some time. In the future we plan to make more efficient releases.

## How to develop

Run: `npm run dev`

On the browser, open `http://localhost:5173/`

To develop serverless mode, run `npm run client-dev-serverless`.

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
- [x] Add a demo link
- [x] Make JSON output git diff friendly
- [x] Easily increase tileset size wthout messing up project
- [x] Warning for when there is no server connected
- [x] Undo and redo
- [x] Tile editor (define new tiles)
- [x] Add warning banner for when data doesns't match the schema (e.g. tile was deleted)
- [x] Level reordering
- [x] Export command and package so it can be run from other repo
- [x] Allow to define properties (for tiles and levels)
- [x] Layers
- [x] Refactor: separate vue element for dropdown
- [x] Serverless mode
- [ ] Build a real demo game in https://github.com/zommerfelds/MiniLevelEditor-game-demo
- [ ] Define the auto-mapping model
- [ ] Add nicer default tileset
- [ ] Better way of defining new tiles (pick from image instead of x/y, auto-add all)
- [ ] Paint multiple tiles at the same time
- [ ] [WIP] More basic tools (e.g. eraser, move tile(s), selection)
- [ ] Support multiple tilesets
- [ ] Randomize drawing (maybe: way to define brushes)
- [ ] Add warning for old version
- [ ] Load tilesets from a better folder ("tilesets"? root folder?)
- [ ] Polish serverless UI (make it clear when a new level is created)
- [ ] Make dependencies lightweight by only shipping the dist files (and move to devDependencies)
- [ ] Publish to NPM
- [ ] Make a YouTube video
- [ ] Keyboard shortcuts (e.g. Ctrl-Z for undo)
- [ ] Optimize saving by only sending diffs and batching/throttling (refDebounced?)
- [ ] Fix `npm run client-type-check`
- [ ] Unit test for loading (makes sure file is not modified)
- [ ] Check validity of levels.json file (e.g. using https://github.com/gristlabs/ts-interface-checker)
- [ ] Fill tool
- [ ] Copy paste
- [ ] Change favicon

## Appendix: Notes

### How to optimize file syncing

Single diff:
https://www.npmjs.com/package/fast-json-patch

Collaborative:
https://github.com/share/sharedb
https://github.com/sueddeutsche/json-sync
