import Compiler from './compiler'

export default class MVVM {
  constructor(options) {
    let element = document.querySelector(options.el)
    new Compiler(element, options.data)
  }
}
