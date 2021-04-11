const currying = function (fn) {
  let args = []
  return function temp(...newArgs) {
    if (newArgs.length) {
      args = [...args, ...newArgs]
      return temp
    } else {
      const val = fn.apply(this, args)
      args = []
      return val
    }
  }
}
function add(...args) {
  return args.reduce((pre, next) => {
    return pre + next
  }, 0)
}
const addCurry = currying(add)
