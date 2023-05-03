// n: Nml
// i: Ide
// e: Exp = n | i |  true |  false | uop e | e bop e | i e* | e ? e : e | [ e* ]  | e [e]
// s:-Stm =  let i = e | func i i* = e | i = e |  print e | while e b
// b: Block = block s*
// p: Program  program b

type Value = number | boolean | Value[] | ((...args: number[]) => Value) | [Identifier[], Expression] | undefined;
let memory = new Map<string, Value>();

class Program {
  constructor(public body: Block) { }
  interpret(): void {
    this.body.interpret();
  }
}


class Block {
  constructor(public statements: Statement[]) { }
  interpret(): void {
    for (const statement of this.statements) {
      statement.interpret();
    }
  }
}

interface Statement {
  interpret(): void;
}

class VariableDeclaration implements Statement {
  constructor(public id: Identifier, public expression: Expression) { }
  interpret(): void {
    if (memory.has(this.id.name)) {
      throw new Error("Variable already declared.");
    }
    memory.set(this.id.name, this.expression.interpret());
  }
}

class FunctionDeclaration implements Statement {
  constructor(public id: Identifier, public parameters: Identifier[], public expression: Expression) { }
  interpret(): void {
    if (memory.has(this.id.name)) {
      throw new Error("Function already declared.");
    }
    memory.set(this.id.name, [this.parameters, this.expression]);
  }
}

class Assignment implements Statement {
  constructor(public id: Identifier, public expression: Expression) { }
  interpret(): void {
    if (!memory.has(this.id.name)) {
      throw new Error("Variable not declared.");
    }
    memory.set(this.id.name, this.expression.interpret());
  }
}

class PrintStatement implements Statement {
  constructor(public expression: Expression) { }
  interpret(): void {
    console.log(this.expression.interpret());
  }
}

class WhileStatement implements Statement {
  constructor(public condition: Expression, public block: Block) { }
  interpret(): void {
    while (this.condition.interpret()) {
      this.block.interpret();
    }
  }
}

interface Expression {
  interpret(): Value;
}

class Numeral implements Expression {
  constructor(public value: number) { }
  interpret(): Value {
    return this.value;
  }
}

class Identifier implements Expression {
  constructor(public name: string) { }
  interpret(): Value {
    return this.name;
  }
}

class BooleanLiteral implements Expression {
  constructor(public value: boolean) { }
  interpret(): Value {
    return this.value;
  }
}

class BinaryExpression implements Expression {
  constructor(public operator: string, public left: Expression, public right: Expression) { }
  interpret(): Value {
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

class CallExpression implements Expression {
  constructor(public id: Identifier, public call: Expression[]) { }
  interpret(): Value {
    return 0
  }
}

class ConditionalExpression implements Expression {
  constructor(public test: Expression, public consequent: Expression, public alternate: Expression) { }
  interpret(): Value {
    return this.test.interpret()
      ? this.consequent.interpret()
      : this.alternate.interpret();
  }
}

class ArrayExpression implements Expression {
  constructor(public elements: Expression[]) { }
  interpret(): Value {
    const array = this.elements.map(element => element.interpret());
    return array[0];
  }
}

class SubscriptExpression implements Expression {
  constructor(public array: Expression, public subscript: Expression) { }
  interpret(): Value {
    const array = this.array.interpret();
    const subscript = this.subscript.interpret();
    return array[subscript];
  }
}

class UnaryExpression implements Expression {
  constructor(public operator: string, public argument: Expression) { }
  interpret(): Value {
    switch (this.operator) {
      case "-":
        return -this.argument.interpret();
      case "!":
        return !this.argument.interpret();
    }
  }
}

function interpret(program: Program): void {
  return program.interpret();
}

// get false on wrong condition 2 == "1"
const sample1 = new Program(
  new Block([
    new PrintStatement(
      new BinaryExpression("==", new Numeral(2), new Identifier("1"))
    )
  ])
);

// get 1 on condition get true
const sample2 = new Program(
  new Block([
    new PrintStatement(
      new ConditionalExpression(
        new BinaryExpression("==", new Numeral(2), new Numeral(2)),
        new Numeral(1),
        new Numeral(0)
      )
    )
  ])
);

interpret(sample1);
interpret(sample2);