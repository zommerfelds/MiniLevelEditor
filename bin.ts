#!/usr/bin/env ts-node

import { cd, exec } from 'shelljs'
import * as colors from '@colors/colors/safe'

console.log('Starting ' + colors.green('MiniLevelEditor') + '...')

cd(__dirname)
exec('npm run prod')
