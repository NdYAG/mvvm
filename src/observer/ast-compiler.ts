import * as isString from 'lodash.isstring'

function isNumber(ch) {
    return '0' <= ch && ch <= '9'
}

function isIdentifier(ch) {
    return (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_' || ch === '$'
}

class Lexer {
    private index: number
    private char: string
    private tokens: Array<any>
    public text: string
    lex(text) {
        this.text = text
        this.index = 0
        this.tokens = []
        while (this.index < text.length) {
            this.char = text.charAt(this.index)
            if (isNumber(this.char) || (this.char === '.' && isNumber(this.peek()))) {
                this.readNumber()
            } else if (this.char === "'" || this.char === '"') {
                this.readString(this.char)
            } else if ('[],{}:.'.indexOf(this.char) > -1) {
                this.tokens.push({ text: this.char })
                this.index++
            } else if (isIdentifier(this.char)) {
                this.readIdentifier()
            }
        }
        return this.tokens
    }
    readNumber() {
        let number = ''
        while (this.index < this.text.length) {
            let char = this.text.charAt(this.index)
            if (isNumber(char) || char === '.') {
                number += char
            } else {
                break
            }
            this.index++
        }
        this.tokens.push({
            text: number,
            value: Number(number)
        })
    }
    readString(quote) {
        let string = ''
        this.index++
        while (this.index < this.text.length) {
            let char = this.text.charAt(this.index)
            if (char === quote) {
                this.index++
                this.tokens.push({
                    text: string,
                    value: String(string)
                })
                return
            } else {
                string += char
            }
            this.index++
        }
        throw new Error('Unmatched Quote')
    }
    readIdentifier() {
        let text = ''
        while (this.index < this.text.length) {
            let char = this.text.charAt(this.index)
            if (isIdentifier(char) || isNumber(char)) {
                text += char
            } else {
                break
            }
            this.index++
        }
        this.tokens.push({
            text,
            identifier: true
        })
    }
    peek() {
        return this.index < this.text.length - 1 ? this.text.charAt(this.index + 1) : false
    }
}

const enum ASTTypes {
    PROGRAM = 'Program',
    LITERAL = 'Literal',
    PROPERTY = 'Property',
    IDENTIFIER = 'Identifier',
    MEMBEREXPRESSION = 'MemberExpression'
}

const ASTConstants = {
    null: {
        type: ASTTypes.LITERAL,
        value: null
    },
    true: {
        type: ASTTypes.LITERAL,
        value: true
    },
    false: {
        type: ASTTypes.LITERAL,
        value: false
    }
}

class AST {
    tokens: Array<any>
    constructor(public lexer: Lexer) { }
    ast(text) {
        this.tokens = this.lexer.lex(text)
        return this.program()
    }
    program() {
        return {
            type: ASTTypes.PROGRAM,
            body: this.primary()
        }
    }
    primary() {
        let tokenText = this.tokens[0].text
        let primary
        if (ASTConstants.hasOwnProperty(tokenText)) {
            primary = ASTConstants[this.consume(tokenText).text]
        } else if (this.peek().identifier) {
            primary = this.identifier()
        } else {
            primary = this.constant()
        }
        let next
        while ((next = this.expect('.', '['))) {
            if (next.text === '[') {
                primary = {
                    type: ASTTypes.MEMBEREXPRESSION,
                    object: primary,
                    property: this.primary(),
                    computed: true
                }
                this.consume(']')
            } else {
                primary = {
                    type: ASTTypes.MEMBEREXPRESSION,
                    object: primary,
                    property: this.identifier(),
                    computed: false
                }
            }
        }
        return primary
    }
    constant() {
        return {
            type: ASTTypes.LITERAL,
            value: this.consume().value
        }
    }
    identifier() {
        return {
            type: ASTTypes.IDENTIFIER,
            name: this.consume().text
        }
    }
    peek(...tokens: any[]) {
        tokens = tokens.filter(token => token !== void 0)
        if (this.tokens.length > 0) {
            if (tokens.indexOf(this.tokens[0].text) > -1 || !tokens.length) {
                return this.tokens[0]
            }
        }
    }
    expect(...tokens: any[]) {
        if (this.peek(...tokens)) {
            return this.tokens.shift()
        }
    }
    consume(e?: string) {
        let token = this.expect(e)
        if (!token) {
            throw new Error(`Unexpected. Expecting ${e}.`)
        }
        return token
    }
}

class ASTCompiler {
    constructor(public astBuilder: AST) { }
    compile(text) {
        let ast = this.astBuilder.ast(text)
        return this.recurse(ast)
    }
    recurse(ast) {
        switch (ast.type) {
            case ASTTypes.PROGRAM:
                return this.recurse(ast.body)
            case ASTTypes.LITERAL:
                return this.escape(ast.value)
            case ASTTypes.IDENTIFIER:
                return this.nonComputedMember('scope', ast.name)
            case ASTTypes.MEMBEREXPRESSION:
                let left = this.recurse(ast.object)
                if (ast.computed) {
                    let right = this.recurse(ast.property)
                    return this.computedMember(left, right)
                } else {
                    return this.nonComputedMember(left, ast.property.name)
                }
        }
    }
    nonComputedMember(left, right) {
        return {
            object: left,
            property: right
        }
    }
    computedMember(left, right) {
        return {
            object: left,
            property: right
        }
    }
    escape(value) {
        if (isString(value)) {
            return `"${value}"`
        } else {
            return value
        }
    }
}

class Parser {
    private ast: AST
    private astCompiler: ASTCompiler
    constructor(public lexer: Lexer) {
        this.ast = new AST(lexer)
        this.astCompiler = new ASTCompiler(this.ast)
    }
    parse(text) {
        return this.astCompiler.compile(text)
    }
}

export function parse(expr) {
    let lexer = new Lexer()
    let parser = new Parser(lexer)
    return parser.parse(expr)
}
