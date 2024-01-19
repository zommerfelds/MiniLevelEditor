# MiniLevelEditor

A small level editor meant to be run in the browser. This is useful for game jams or if you want to minimize required software installs. The goal is to run this in an online IDE e.g. Github Codespaces.

## ⚠️ Work in progress ⚠️

This tool is not implemented yet. Feel free to open an issue if you are interested to say hello :)

## How to run

Run: `npm run dev`

On the browser, open `http://localhost:5173/`

## TODO list

- [x] Set up basic Vue project
- [x] Add a basic level switcher sidebar with state
- [x] Integrate with local server
- [ ] Save the state to disk
- [ ] Add warning for when there is no server connected
- [ ] Define a level format
- [ ] Implement tile paining UI with just colors
- [ ] Use tileset from file
- [ ] Toolbar with basic tools (eraser? mover)
- [ ] Layers
- [ ] Define the auto-mapping model
- [ ] Allow to define tile properties
- [ ] Make project configuration (e.g. filename) more flexible
- [ ] Export package so it can be run with npx
- [ ] Add a demo link
- [ ] Make a YouTube video
- [ ] Optimize saving by only sending diffs

## Appendix: Notes

### How to optimize file syncing

Single diff:
https://www.npmjs.com/package/fast-json-patch

Collaborative:
https://github.com/share/sharedb
https://github.com/sueddeutsche/json-sync