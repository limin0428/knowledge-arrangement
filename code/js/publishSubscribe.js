class Event {
    constructor() {
        this._events = {}
    }
    $on (eventName, event) {
        if (this._events[eventName]) {
            this._events[eventName].push(event)
        } else {
            this._events[eventName] = [event]
        }
        return this
    }
    $emit (eventName, data) {
        if (this._events[eventName]) {
            this._events[eventName].forEach(cb => cb(data))
        }
        return this
    }
    $remove (eventName, event) {
        if (event) {
            this._events[eventName].filter(cb => cb === event) 
        } else {
            delete this._events[eventName]
        }
    }
    $clear () {
        this._events = {}
    }
}
var s = new Event()
s.$on('eat',eat).$on('play',play)
function eat (food) {
    console.log(food)
}
function play (toys) {
    console.log(toys)
}
s.$emit('play', '足球').$emit('eat', '西红柿')
