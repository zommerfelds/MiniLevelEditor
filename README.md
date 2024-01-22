![MiniLevelEditor logo](https://github.com/zommerfelds/MiniLevelEditor/assets/1260622/63d75f6f-49e2-4641-9e41-6296588dc612)

A small tile-based level editor that runs in the browser. This is useful for game jams or if you want to minimize required software installs. The goal is to run this in an online IDE e.g. Github Codespaces. The emphasis of this project is on the workflow, not necessarily on having all kinds of features.mode: Phaser.Scale.FIT,

## ⚠️ Work in progress ⚠️

This tool is not implemented yet. Feel free to open an issue if you are interested to say hello :)

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
- [ ] Implement basic tile paining UI
- [ ] Use tileset from image
- [ ] Toolbar with basic tools (eraser? mover)
- [ ] Layers
- [ ] Define the auto-mapping model
- [ ] Allow to define tile properties
- [ ] Make project configuration (e.g. filename) more flexible
- [ ] Export package so it can be run with npx
- [ ] Serverless mode + warning for when there is no server connected
- [ ] Add a demo link
- [ ] Make JSON output git diff friendly
- [ ] Make a YouTube video
- [ ] Optimize saving by only sending diffs

## Appendix: Notes

### How to optimize file syncing

Single diff:
https://www.npmjs.com/package/fast-json-patch

Collaborative:
https://github.com/share/sharedb
https://github.com/sueddeutsche/json-sync
