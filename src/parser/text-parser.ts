import Parser from './super'

export default class TextParser extends Parser {
  parse() {
    // <p>Hello ${name}</p>
    // `Hello ${name}`
    // new Function('return `Hello ${name}`')
    return '`' + this.directive + '`'
  }
  update(value) {
    this.node.textContent = value
  }
}
