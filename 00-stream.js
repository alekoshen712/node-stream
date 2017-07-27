/**

 所有的流都是 EventEmitter 的实例。

 流的四种基本类型
  1. Readable  - 可读的流 (例如 fs.createReadStream()).
  2. Writable  - 可写的流 (例如 fs.createWriteStream()).
  3. Duplex    - 可读写的流 (例如 net.Socket).
  4. Transform - 在读写过程中可以修改和变换数据的 Duplex 流 (例如 zlib.createDeflate())

 对象模式
  所有使用 Node.js API 创建的流对象都只能操作 strings 和 Buffer(或 Uint8Array) 对象
  但是,通过一些第三方流的实现,你依然能够处理其它类型的 JavaScript 值 (除了 null，它在流处理中有特殊意义).这些流被认为是工作在 “对象模式”(object mode)
  在创建流的实例时,可以通过 objectMode 选项使流的实例切换到对象模式。试图将 已经存在的流切换到对象模式是不安全的

 缓冲
  Writable 和 Readable 流都会将数据存储到内部的缓存（buffer）中

  缓存的大小取决于传递给流构造函数的 highWaterMark 选项
    普通的流,highWaterMark 选项指定了总共的字节数
    对象模式的流,highWaterMark 指定对象的总数

  可读流
    1.调用 stream.push(chunk) 方法时, 数据被放到缓存中. 如果流的消费者没有调用 stream.read() 方法, 这些数据会始终存在于内部队列中,直到被消费。
    2.当缓存的大小达到 highWaterMark 指定的阈值时,流会暂停从底层资源读取数据, 直到当前缓存的数据被消费（也就是说,流会在内部停止调用 readable._read() 来填充可读缓存）

   可读流
    1.调用 stream.push(chunk) 方法时, 数据被放到缓存中. 如果流的消费者没有调用 stream.read() 方法, 这些数据会始终存在于内部队列中,直到被消费。
    2.当缓存的大小达到 highWaterMark 指定的阈值时,流会暂停从底层资源读取数据, 直到当前缓存的数据被消费（也就是说,流会在内部停止调用 readable._read() 来填充可读缓存）


 **/