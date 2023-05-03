// n: Nml
// i: Ide
// e: Exp = n | i |  true |  false | uop e | e bop e | i e* | e ? e : e | [ e* ]  | e [e]
// s:-Stm =  let i = e | func i i* = e | i = e |  print e | while e b
// b: Block = block s*
// p: Program  program b
let memory = new Map();
class Program {
    body;
    constructor(body) {
        this.body = body;
    }
    interpret() {
        this.body.interpret();
    }
}
class Block {
    statements;
    constructor(statements) {
        this.statements = statements;
    }
    interpret() {
        for (const statement of this.statements) {
            statement.interpret();
        }
    }
}
class VariableDeclaration {
    id;
    expression;
    constructor(id, expression) {
        this.id = id;
        this.expression = expression;
    }
    interpret() {
        if (memory.has(this.id.name)) {
            throw new Error("Variable already declared.");
        }
        memory.set(this.id.name, this.expression.interpret());
    }
}
class FunctionDeclaration {
    id;
    parameters;
    expression;
    constructor(id, parameters, expression) {
        this.id = id;
        this.parameters = parameters;
        this.expression = expression;
    }
    interpret() {
        if (memory.has(this.id.name)) {
            throw new Error("Function already declared.");
        }
        memory.set(this.id.name, [this.parameters, this.expression]);
    }
}
class Assignment {
    id;
    expression;
    constructor(id, expression) {
        this.id = id;
        this.expression = expression;
    }
    interpret() {
        if (!memory.has(this.id.name)) {
            throw new Error("Variable not declared.");
        }
        memory.set(this.id.name, this.expression.interpret());
    }
}
class PrintStatement {
    expression;
    constructor(expression) {
        this.expression = expression;
    }
    interpret() {
        console.log(this.expression.interpret());
    }
}
class WhileStatement {
    condition;
    block;
    constructor(condition, block) {
        this.condition = condition;
        this.block = block;
    }
    interpret() {
        while (this.condition.interpret()) {
            this.block.interpret();
        }
    }
}
class Numeral {
    value;
    constructor(value) {
        this.value = value;
    }
    interpret() {
        return this.value;
    }
}
class Identifier {
    name;
    constructor(name) {
        this.name = name;
    }
    interpret() {
        return this.name;
    }
}
class BooleanLiteral {
    value;
    constructor(value) {
        this.value = value;
    }
    interpret() {
        return this.value;
    }
}
class BinaryExpression {
    operator;
    left;
    right;
    constructor(operator, left, right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
    interpret() {
        switch (this.operator) {
            case "<":
                return this.left.interpret() < this.right.interpret();
            case ">":
                return this.left.interpret() > this.right.interpret();
            case "<=":
                return this.left.interpret() <= this.right.interpret();
            case ">=":
                return this.left.interpret() >= this.right.interpret();
            case "==":
                return this.left.interpret() == this.right.interpret();
            case "!=":
                return this.left.interpret() !== this.right.interpret();
        }
    }
}
class CallExpression {
    id;
    call;
    constructor(id, call) {
        this.id = id;
        this.call = call;
    }
    interpret() {
        return 0;
    }
}
class ConditionalExpression {
    test;
    consequent;
    alternate;
    constructor(test, consequent, alternate) {
        this.test = test;
        this.consequent = consequent;
        this.alternate = alternate;
    }
    interpret() {
        return this.test.interpret()
            ? this.consequent.interpret()
            : this.alternate.interpret();
    }
}
class ArrayExpression {
    elements;
    constructor(elements) {
        this.elements = elements;
    }
    interpret() {
        const array = this.elements.map(element => element.interpret());
        return array[0];
    }
}
class SubscriptExpression {
    array;
    subscript;
    constructor(array, subscript) {
        this.array = array;
        this.subscript = subscript;
    }
    interpret() {
        const array = this.array.interpret();
        const subscript = this.subscript.interpret();
        return array[subscript];
    }
}
class UnaryExpression {
    operator;
    argument;
    constructor(operator, argument) {
        this.operator = operator;
        this.argument = argument;
    }
    interpret() {
        switch (this.operator) {
            case "-":
                return -this.argument.interpret();
            case "!":
                return !this.argument.interpret();
        }
    }
}
function interpret(program) {
    return program.interpret();
}
// get false on wrong condition 2 == "1"
const sample1 = new Program(new Block([
    new PrintStatement(new BinaryExpression("==", new Numeral(2), new Identifier("1")))
]));
// get 1 on condition get true
const sample2 = new Program(new Block([
    new PrintStatement(new ConditionalExpression(new BinaryExpression("==", new Numeral(2), new Numeral(2)), new Numeral(1), new Numeral(0)))
]));
interpret(sample1);
interpret(sample2);
export {};
