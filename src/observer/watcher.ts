import Dependency from './dependency'

function createFunction(expression) {
  return new Function(`with(this) {return ${expression}}`)
}

function createSetter(expression) {
  return new Function('value', `with(this) {${expression} = value}`)
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
    this.setter = expression.duplex ? createSetter(expression.value) : null
    this.value = this.get()
  }
  get() {
    Dependency.watcher = this
    let value = this.getter.call(this.vm.model)
    Dependency.watcher = null
    return value
  }
  set(value) {
    this.setter.call(this.vm.model, value)
  }
  update(val) {
    let newValue = this.get()
    this.callback.call(this.context, newValue)
  }
}
