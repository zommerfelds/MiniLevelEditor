#!/usr/bin/env ts-node

import { cd, exec } from 'shelljs'
import * as colors from '@colors/colors/safe'

console.log('Starting ' + colors.green('MiniLevelEditor') + '...')

// TODO: can't just use __dirname, otherwise levels.json will also be loaded from here.
cd(__dirname)
exec('npm run prod')
