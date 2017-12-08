function createFunction(expression) {
  return new Function(`with(this) {return ${expression}}`)
}

export default class Watcher {
  public value: any
  public getter: Function
  constructor(public vm, public expression: String) {
    this.getter = createFunction(expression)
    this.value = this.get()
  }
  get() {
    return this.getter.call(this.vm.model)
  }
}
