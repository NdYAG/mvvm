import Parser from './super'

export default class ModelParser extends Parser {
  parse() {
    if (this.directive.duplex) {
      this.bind()
    }
    return {
      value: this.directive.value,
      duplex: true
    }
  }
  update(value) {
    // <input type="text" />
    ; (<HTMLInputElement>this.node).value = value
  }
  bind() {
    this.node.addEventListener('input', (e) => {
      this.watcher.set((<HTMLInputElement>e.target).value)
    })
  }
}
