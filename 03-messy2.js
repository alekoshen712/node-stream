const fs = require('fs')
const rs = fs.createReadStream('./text.txt', { highWaterMark: 5 })

let content = []
let size = 0

rs.on('data', (chunk) => {
  content.push(chunk)
  size += chunk.length
})

rs.on('end', () => {
  fs.writeFile('./text2.txt', Buffer.concat(content, size), (err) => {
    if (err) console.log(err)
  })
})