import Rule from "../models/rules.model";
import { Request, Response } from "express";

interface ASTNode {
  type: "operator" | "operand";
  operator?: "AND" | "OR";
  left: ASTNode | null;
  right: ASTNode | null;
  value: {
    attribute: string;
    operator: string;
    comparisonValue: string;
  } | null;
}

const tokenize = (ruleString: string): string[] => {
  const tokens =
    ruleString.match(/\(|\)|AND|OR|[><=]+|'[^']*'|[^()\s]+/g) || [];
  return tokens.map((token: string) =>
    token.startsWith("'") && token.endsWith("'") ? token.slice(1, -1) : token
  );
};

function parseCondition(tokens: string[]): ASTNode {
  const attribute = tokens[0];
  const operator = tokens[1];
  const comparisonValue = tokens[2];

  return {
    type: "operand",
    left: null,
    right: null,
    value: {
      attribute,
      operator,
      comparisonValue,
    },
  };
}

function parseTokens(tokens: string[]): ASTNode {
  const stack: (ASTNode | string)[] = [];

  while (tokens.length > 0) {
    const token = tokens.shift()!;

    if (token === "(") {
      const subexpressionTokens: string[] = [];
      let openParens = 1;

      while (tokens.length > 0) {
        const nextToken = tokens.shift()!;
        if (nextToken === "(") openParens++;
        if (nextToken === ")") openParens--;
        if (openParens === 0) break;
        subexpressionTokens.push(nextToken);
      }

      stack.push(parseTokens(subexpressionTokens));
    } else if (token === "AND" || token === "OR") {
      stack.push(token);
    } else if (token) {
      const conditionTokens = [token, tokens.shift()!, tokens.shift()!];
      stack.push(parseCondition(conditionTokens));
    }
  }
  let ast = stack.shift() as ASTNode;

  while (stack.length > 0) {
    const operator = stack.shift() as string;
    const rightOperand = stack.shift() as ASTNode;

    ast = {
      type: "operator",
      operator: operator === "AND" ? "AND" : "OR",
      left: ast,
      right: rightOperand,
      value: null,
    };
  }

  return ast;
}

const createRule = async (req: Request, res: Response) => {
  const { ruleName, ruleString } = req.body;

  try {
    if (!ruleName || !ruleString) {
      res.status(400).json({ error: "Rule name and rule string are required" });
      return;
    }

    const existingRule = await Rule.findOne({ ruleName });
    if (existingRule) {
      res.status(409).json({ error: "Rule name must be unique" });
      return;
    }

    const tokens = tokenize(ruleString);
    const ast = parseTokens(tokens);
    const rule = await Rule.create({
      ruleName,
      ast: JSON.stringify(ast),
    });
    res.status(201).json({ message: "Rule created successfully", rule });
  } catch (err: unknown) {
    console.error("Error creating rule:", err);
    if (err instanceof Error) {
      res.status(500).json({ error: `Failed to create rule: ${err.message}` });
    } else {
      res
        .status(500)
        .json({ error: "An unknown error occurred while creating the rule" });
    }
  }
};

function isEligible(ast: ASTNode, data: { [key: string]: any }): boolean {
  if (ast.type === "operand") {
    const { attribute, operator, comparisonValue } = ast.value!;
    const actualValue = data[attribute];

    switch (operator) {
      case ">":
        return actualValue > parseFloat(comparisonValue);
      case "<":
        return actualValue < parseFloat(comparisonValue);
      case "=":
        return actualValue === comparisonValue;
      default:
        return false;
    }
  }

  if (ast.type === "operator") {
    const leftEval = isEligible(ast.left!, data);
    const rightEval = isEligible(ast.right!, data);

    return ast.operator === "AND"
      ? leftEval && rightEval
      : leftEval || rightEval;
  }

  return false;
}

const evaluateRule = async (req: Request, res: Response) => {
  const { ruleName, data } = req.body;
  try {
    if (!ruleName || !data) {
      res.status(400).json({ error: "Rule name and data are required." });
      return;
    }

    const rule = await Rule.findOne({ ruleName });
    if (!rule) {
      res.status(404).json({ error: `Rule '${ruleName}' not found` });
      return;
    }

    const ast = JSON.parse(rule.ast) as ASTNode;
    const result = isEligible(ast, data);

    res.status(200).json({ result });
  } catch (err: unknown) {
    console.error("Error evaluating rule:", err);
    if (err instanceof Error) {
      res
        .status(500)
        .json({ error: `Failed to evaluate rule: ${err.message}` });
    } else {
      res
        .status(500)
        .json({ error: "An unknown error occurred while evaluating the rule" });
    }
  }
};

function areNodesEqual(node1: ASTNode, node2: ASTNode): boolean {
  if (node1.type !== node2.type) return false;

  if (node1.type === "operand") {
    return (
      node1.value?.attribute === node2.value?.attribute &&
      node1.value?.operator === node2.value?.operator &&
      node1.value?.comparisonValue === node2.value?.comparisonValue
    );
  }

  return (
    node1.operator === node2.operator &&
    areNodesEqual(node1.left!, node2.left!) &&
    areNodesEqual(node1.right!, node2.right!)
  );
}

function flattenOperatorNodes(
  node: ASTNode,
  operator: "AND" | "OR"
): ASTNode[] {
  if (node.type === "operator" && node.operator === operator) {
    return [
      ...flattenOperatorNodes(node.left!, operator),
      ...flattenOperatorNodes(node.right!, operator),
    ];
  }
  return [node];
}

function removeDuplicateNodes(nodes: ASTNode[]): ASTNode[] {
  return nodes.filter((node, index) => {
    return !nodes
      .slice(0, index)
      .some((otherNode) => areNodesEqual(node, otherNode));
  });
}

function combineRulesAST(rules: ASTNode[], operator: "AND" | "OR"): ASTNode {
  let combinedNodes: ASTNode[] = [];

  rules.forEach((rule) => {
    const flattenedNodes = flattenOperatorNodes(rule, operator);
    combinedNodes.push(...flattenedNodes);
  });

  combinedNodes = removeDuplicateNodes(combinedNodes);

  if (combinedNodes.length === 1) {
    return combinedNodes[0];
  }

  return combinedNodes.reduce((combinedAST, ruleAST) => {
    return {
      type: "operator",
      operator: operator,
      left: combinedAST,
      right: ruleAST,
      value: null,
    };
  });
}

const combineRules = async (req: Request, res: Response) => {
  const { ruleNames, operator, newRuleName } = req.body;

  if (!Array.isArray(ruleNames) || ruleNames.length < 2) {
    res.status(400).json({ error: "At least two rule names are required" });
    return;
  }

  if (operator !== "AND" && operator !== "OR") {
    res.status(400).json({ error: 'Invalid operator. Must be "AND" or "OR"' });
    return;
  }

  try {
    const rules = await Rule.find({ ruleName: { $in: ruleNames } });

    if (rules.length !== ruleNames.length) {
      res.status(404).json({ error: "One or more rules not found" });
      return;
    }

    const astNodes = rules.map((rule) => JSON.parse(rule.ast) as ASTNode);

    const combinedAST = combineRulesAST(astNodes, operator);

    const newRule = await Rule.create({
      ruleName: newRuleName,
      ast: JSON.stringify(combinedAST),
    });

    res.status(201).json({
      message: "Rules combined successfully",
      newRule: {
        id: newRule._id,
        ruleName: newRule.ruleName,
        ast: combinedAST,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const getAllRuleNames = async (req: Request, res: Response) => {
  try {
    const rules = await Rule.find({}, "ruleName");
    const ruleNames = rules.map((rule) => rule.ruleName);
    res.status(200).json({ ruleNames });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

const getRuleByName = async (req: Request, res: Response) => {
  const { ruleName } = req.params;

  try {
    const rule = await Rule.findOne({ ruleName });
    if (!rule) {
      res.status(404).json({ error: "Rule not found" });
      return;
    }

    const ast = JSON.parse(rule.ast);
    res.status(200).json({
      ruleName: rule.ruleName,
      ast: ast,
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export {
  createRule,
  evaluateRule,
  combineRules,
  getAllRuleNames,
  getRuleByName,
};
