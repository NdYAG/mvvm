import Parser from './super'

export default class ModelParser extends Parser {
  parse() {
    return this.directive
  }
  update(value) {
    // <input type="text" />
    ;(<HTMLInputElement>this.node).value = value
  }
}
