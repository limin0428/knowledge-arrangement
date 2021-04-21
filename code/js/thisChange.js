// apply的实现
const _apply = function () {
  const center = [...arguments][0]
  const args = [...arguments][1]
  console.log(args)
  center.self = this
  const result = center.self(...args)
  delete center.self
  return result
}
Function.prototype._apply = _apply

// call的实现
const _call = function () {
  const [center , ...args] = [...arguments]
  console.log(args)
  center.self = this
  const result = center.self(...args)
  delete center.self
  return result
}
Function.prototype._call = _call

// bind实现
const _bind = function () {
  const center = arguments[0]
  const self = this
  return function () {
    self.apply(center, arguments)
  }
}
Function.prototype._bind = _bind
