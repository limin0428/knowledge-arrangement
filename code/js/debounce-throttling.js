const debounce = function (fn, wait = 1500, immediate = false) {
  let timer, timeStamp = 0, self, args
  const run = wait => {
    timer = setTimeout(() => {
      fn.apply(self, args)
      timer = null
    }, wait)
  }
  return function () {
    self = this
    args = arguments
    const now = new Date().getTime()
    if (!timer && immediate) {
      fn.apply(self, args)
    }
    if (now - timeStamp > wait) {
      run(wait)
    } else {
      clearTimeout(timer)
      run(wait)
    }
    timeStamp = now
  }
}

const debounce2 = function (fn, wait = 1500, immediate = false) {
  let timer, timeStamp = 0, self, args
  const run = timerInterval => {
    timer = setTimeout(() => {
      const now = new Date().getTime()
      const interval = now - timerInterval
      if (interval < timerInterval) {
        timeStamp = now
        run(wait - interval)
      } else {
        if (!immediate) {
          fn.apply(self, args)
        }
        clearTimeout(timer)
        timer = null
      }
    }, timerInterval)
  }
  return function () {
    self = this
    args = arguments
    const now = new Date().getTime()
    timeStamp = now
    if (!timer) {
      if (immediate) {
        fn.apply(self, args)
      }
      run(wait)
    }
  }
}

const throttling = (fn, wait = 1500, immediate = false) => {
  let timer, self, args
  const run = () => {
    timer = setTimeout(() => {
      fn.apply(self, args)
      clearTimeout(timer)
      timer = null
    }, wait)
  }
  return function () {
    self = this
    args = arguments
    if (!timer) {
      if (immediate) {
        fn.apply(self, args)
      }
      run()
    }
  }
}