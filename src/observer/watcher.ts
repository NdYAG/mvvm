import Dependency from './dependency'
import { parse } from './ast-compiler'

function createFunction(expression) {
  return new Function(`with(this) {return ${expression}}`)
}

function createSetter(scope, expression) {
  let result = parse(expression)
  return function (value) {
    if (result.object !== 'scope') {
      scope[result.object][result.property] = value
    } else {
      scope[result.property] = value
    }
  }
}

let id = 0

export default class Watcher {
  public id: number
  public value: any
  public getter: Function
  public setter: Function
  constructor(
    public vm,
    public expression: Expression,
    public callback: Function,
    public context: any
  ) {
    this.id = id++
    this.getter = createFunction(expression.value)
    this.setter = expression.duplex ? createSetter(vm.model, expression.value) : null
    this.value = this.get()
  }
  get() {
    Dependency.watcher = this
    let value = this.getter.call(this.vm.model)
    Dependency.watcher = null
    return value
  }
  set(value) {
    this.setter(value)
  }
  update(val) {
    let newValue = this.get()
    this.callback.call(this.context, newValue)
  }
}
