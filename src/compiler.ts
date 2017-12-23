import { TextParser, ModelParser } from './parser'

const isElement = node => node.nodeType === Node.ELEMENT_NODE
const isTextNode = node => node.nodeType === Node.TEXT_NODE
const RE_TEMPLATE = /\${([^{|^}]+)}/

function hasDirective(node: Node): Boolean {
  if (isElement(node)) {
    if (node.hasAttributes()) {
      for (let i = 0, l = node.attributes.length; i < l; i++) {
        let attr = node.attributes[i]
        if (attr.name.indexOf('v-') === 0) {
          return true
        }
      }
    }
  } else if (isTextNode(node)) {
    return RE_TEMPLATE.test(node.textContent)
  }
  return false
}

export default class Compiler {
  constructor(public element: Node, public model: Object) {
    this.compile(element)
  }
  compile(element) {
    let childNodes = element.childNodes
    for (let i = 0, l = childNodes.length; i < l; i++) {
      let node = childNodes[i]
      if (hasDirective(node)) {
        this.compileNode(node)
      }
      if (node.hasChildNodes()) {
        this.compile(node)
      }
    }
  }
  compileNode(node) {
    if (isElement(node)) {
      this.parseElement(node)
    }
    if (isTextNode(node)) {
      this.parseText(node)
    }
  }
  parseElement(node) {
    let attrs = node.attributes
    for (let i = 0, l = attrs.length; i < l; i++) {
      let attr = attrs[i]
      switch (attr.name) {
        case 'v-model': {
          new ModelParser(this, node, {
            value: attr.value,
            duplex: true
          })
          continue
        }
        default:
          continue
      }
    }
  }
  parseText(node) {
    new TextParser(this, node, {
      value: node.textContent
    })
  }
}
