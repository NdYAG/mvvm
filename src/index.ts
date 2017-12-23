import { observe } from './observer'
import Compiler from './compiler'

export default class MVVM {
  constructor(public options) {
    let element = document.querySelector(options.el)
    observe(options.data)
    new Compiler(element, options.data)
  }
}
