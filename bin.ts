#!/usr/bin/env ts-node

import { cd, exec } from 'shelljs'
import { green, bold } from '@colors/colors/safe'

const packageJson = require('./package.json')

console.log('Starting ' + bold(green('MiniLevelEditor')) + ' ' + packageJson.version + '...')

// TODO: can't just use __dirname, otherwise levels.json will also be loaded from here.
cd(__dirname)
exec('npm run prod')
