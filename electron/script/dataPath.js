const path = require('path')

const configPath = path.resolve('./data/config.json')
const dataPath = path.resolve('./data/data.json')
const errPath = path.resolve('./data/error.js')

module.exports = {configPath, dataPath, errPath}