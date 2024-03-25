#!/usr/bin/env ts-node

import * as sh from 'shelljs'
import * as path from 'path'
import { green, bold } from '@colors/colors/safe'

const packageJson = require('./package.json')

console.log('Starting ' + bold(green('MiniLevelEditor')) + ' ' + packageJson.version + '...')

const args = process.argv.slice(2)
let levelsFilePath = args[0]
if (levelsFilePath === undefined) {
  levelsFilePath = 'levels.json'
  console.info(`No file path argument specified, defaulting to "${levelsFilePath}"`)
}

// Before changing directory, get the full path for the levels file.
// TODO: support absolute paths
levelsFilePath = path.join(sh.pwd().toString(), levelsFilePath)

// Change into the MiniLevelEditor directory, so we can run npm scripts from here.
sh.cd(__dirname)

// One -- is needed to escape from npm, the other is needed to escape from concurrently.
sh.exec(`npm run prod -- -- ${levelsFilePath}`)
