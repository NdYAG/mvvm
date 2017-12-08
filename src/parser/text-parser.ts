import Parser from './super'

export default class TextParser extends Parser {
  parse() {
    // <p>Hello ${name}</p>
    // `Hello ${name}`
    // new Function('return `Hello ${name}`')
    let expression = this.node.textContent
    return '`' + expression + '`'
  }
  update(value) {
    this.node.textContent = value
  }
}
