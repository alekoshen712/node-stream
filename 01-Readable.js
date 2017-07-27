const Readable = require('stream').Readable

class ToReadable extends Readable {
  constructor(iterator) {
    super()
    this.iterator = iterator
  }

  // 从底层系统读取具体数据的逻辑,即生产数据的逻辑
  _read() {
    const res = this.iterator.next()
    // 数据源已枯竭，调用`push(null)`通知流
    if (res.done) return this.push(null)
    // 通过`push`方法将数据添加到流中, 可同步可异步
    this.push(res.value + '\n')
  }
}

const iterator = function (limit) {
  return {
    next: function () {
      if (limit--) {
        return {done: false, value: limit + Math.random()}
      }
      return {done: true}
    }
  }
}(1e3)

const readable = new ToReadable(iterator)

// 只有监听了data事件后,readable才会持续不断的调用 _read 方法.
// readable.on('data', data => process.stdout.write(data))

// 所有数据均已读完
readable.on('end', () => process.stdout.write('DONE'))

