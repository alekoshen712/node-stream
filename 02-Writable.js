const fs = require('fs')

let readable1 = fs.createReadStream('./00-stream.js')
let writable1 = fs.createWriteStream('./music.txt')

// readable1.pipe(writable1)

readable1.on('data', function (data) {
 // 如果内部缓冲区的大小小于创建流时设定的 highWaterMark 阈值,函数将返回true,如果返回值为false,应该停止向流中写入数据(此例子中是将可读流变为paused,即停止生产数据),直到 drain 事件被触发
  if (false === writable1.write(data)) {
    readable.pause()
  }
})

writable1.on('drain', function () {
  readable.resume()
})


const stream = require('stream')

var c = 0
const readable2 = stream.Readable({
  highWaterMark: 2,
  read: function () {
    process.nextTick(() => {
      var data = c < 6 ? String.fromCharCode(c + 65) : null
      console.log('push', ++c, data)
      this.push(data)
    })
  }
})

const writable2 = stream.Writable({
  highWaterMark: 1,
  write: function (chunk, enc, next) {
    console.log('write', chunk.toString())
    // next()
  }
})

readable2.pipe(writable2)