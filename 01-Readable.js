const Readable = require('stream').Readable

class ToReadable extends Readable {
  constructor(iterator) {
    super()
    this.iterator = iterator
  }

  // 从底层系统读取具体数据的逻辑,即生产数据的逻辑
  _read() {
    const res = this.iterator.next()
    if (res.value === 8) {
      this.pause() //flowing: false
    }
    // if (res.value === 4) {
    //   this.resume() //flowing: true
    // }

    // 数据源已枯竭，调用 push(null) 通知流
    if (res.done) return this.push(null)
    // 通过 push方法 将数据添加到流中, 可同步可异步
    this.push(res.value.toString())
  }
}

const iterator = function (limit) {
  return {
    next: function () {
      if (limit--) {
        return {done: false, value: limit}
      }
      return {done: true}
    }
  }
}(10)

const readable = new ToReadable(iterator)  // flowing: null

// 只有监听了data事件后,readable才会持续不断的调用 _read 方法.
readable.on('data', data => console.log('data:' + data))  // flowing: true

// 所有数据均已读完
readable.on('end', () => console.log('data:DONE'))

/*
 可读流的两种模式
 1.flowing 可读流自动从系统底层读取数据，并通过 EventEmitter 接口的事件尽快将数据提供给应用
 2.paused  必须显式调用 stream.read() 方法来从流中读取数据片段

 可读流的工作模式切换
 flowing
 1.监听 data 事件 (paused模式下不起作用)
 2.调用 stream.resume() 方法
 3.调用 stream.pipe() 方法将数据发送到 Writable
 paused
 1.如果不存在管道目标（pipe destination,可以通过调用 stream.pause() 方法实现
 2.如果存在管道目标,可以通过取消 'data' 事件监听,并调用 stream.unpipe() 方法移除所有管道目标来实现

 # 这里需要记住的重要概念就是，可读流需要先为其提供消费或忽略数据的机制，才能开始提供数据。如果消费机制被禁用或取消，可读流将 尝试 停止生成数据
 # 为了向后兼容,取消data事件监听并不会自动将流暂停.同时,如果存在管道目标（pipe destination）,且目标状态变为可以接收数据,调用了 stream.pause() 方法也并不保证流会一直保持暂停状态
 # 如果 Readable 切换到 flowing 模式,且没有消费者处理流中的数据,这些数据将会丢失.比如,调用了 readable.resume() 方法却没有监听 data 事件,或是取消了 data 事件监听，就有可能出现这种情况

 */