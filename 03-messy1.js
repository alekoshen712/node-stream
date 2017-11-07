const fs = require('fs')

const rs = fs.createReadStream('./text.txt', { highWaterMark: 5 })
rs.setEncoding('utf8')

let content = ''

rs.on('data', (chunk) => {
  content += chunk
})

rs.on('end', () => fs.writeFile('./text1.txt', content, (err) => err && console.log(err)))