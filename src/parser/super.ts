import Watcher from '../observer/watcher'

export default abstract class Parser {
  public watcher: Watcher
  constructor(public vm, public node: Node, public directive: Directive) {
    let expression = this.parse()
    this.watcher = new Watcher(vm, expression, this.update, this)
    this.update(this.watcher.value)
  }
  abstract parse(): Expression
  abstract update(value: any): void
}
