import Watcher from '../watcher'

export default abstract class Parser {
  constructor(public vm, public node: Node, public directive: String) {
    let expression = this.parse()
    let watcher = new Watcher(vm, expression)
    this.update(watcher.value)
  }
  abstract parse(): String
  abstract update(value: any): void
}
