import Dependency from './dependency'
import * as isPlainObject from 'lodash.isplainobject'

export function observe(obj) {
  if (Array.isArray(obj)) {
    obj.forEach(item => {
      observe(item)
    })
  } else if (isPlainObject(obj)) {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
}

function defineReactive(obj, key, val) {
  let depend = new Dependency()
  observe(val)
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dependency.watcher) {
        depend.addWatcher(Dependency.watcher)
      }
      return val
    },
    set(newVal) {
      if (newVal !== val) {
        val = newVal
        observe(newVal)
        depend.notify(newVal)
      }
    }
  })
}
