import {
  ESLintUtils,
  AST_NODE_TYPES,
  TSESTree,
} from "@typescript-eslint/utils";

export const classNameSingleSpacesRule = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "layout",
    fixable: "code",
    messages: {
      classNameSingleSpaces: "Only single spaces should be used in className",
      cornerCharactersSpaces: "Corner characters should not be spaces",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        const nodes: TSESTree.Node[] = [];

        const checkLiteralValueSpaces = (
          value: unknown,
          errorNode: TSESTree.Node
        ) => {
          if (value && typeof value === "string") {
            nodes.push(errorNode);

            if (value.includes("  ")) {
              context.report({
                node,
                messageId: "classNameSingleSpaces",
                *fix(fixer) {
                  for (const _node of nodes) {
                    yield fixer.replaceText(
                      _node,
                      context
                        .getSourceCode()
                        .getText(_node)
                        .replace(/\s+/gm, " ")
                    );
                  }
                },
              });
            }
            if (value.endsWith(" ") || value.startsWith(" ")) {
              context.report({
                node,
                messageId: "cornerCharactersSpaces",
                *fix(fixer) {
                  for (const _node of nodes) {
                    const sourceNodeText = context
                      .getSourceCode()
                      .getText(_node);
                    const newNodeText =
                      sourceNodeText[0] +
                      sourceNodeText
                        .slice(1, sourceNodeText.length - 1)
                        .replaceAll(/^\s+|\s+$/gm, "") +
                      sourceNodeText[sourceNodeText.length - 1];

                    yield fixer.replaceText(_node, newNodeText);
                  }
                },
              });
            }
          }
        };

        const checkTemplateLiteralQuasisSpaces = (
          quasis: TSESTree.TemplateElement[]
        ) => {
          const notEmptyTemplateElements: { value: string; index: number }[] =
            [];

          if (quasis.length === 1) {
            if (quasis[0])
              checkLiteralValueSpaces(quasis[0].value.raw, quasis[0]);
            return;
          }

          quasis.forEach((templateElement, index) => {
            const value = templateElement.value.raw;
            if (value === " " || value === "  ") {
              checkLiteralValueSpaces(value, templateElement);
              return;
            }
            const trimmedValue = value.slice(1, value.length - 1);
            if (trimmedValue) {
              notEmptyTemplateElements.push({ value: trimmedValue, index });
            }
          });

          notEmptyTemplateElements.forEach(({ value, index }) => {
            const node = quasis[index];
            if (node) {
              checkLiteralValueSpaces(value, node);
            }
          });
        };
        const checkTemplateLiteralExpressionsSpaces = (
          expressions: TSESTree.Expression[]
        ) => {
          expressions.forEach((expression) => {
            if (expression.type === AST_NODE_TYPES.Literal) {
              checkLiteralValueSpaces(expression.value, expression);
            }
            if (expression.type === AST_NODE_TYPES.ConditionalExpression) {
              checkConditionalExpression(expression);
            }
            if (expression.type === AST_NODE_TYPES.LogicalExpression) {
              checkLogicalExpression(expression);
            }
            if (expression.type === AST_NODE_TYPES.BinaryExpression) {
              checkBinaryExpression(expression);
            }
          });
        };

        const checkConditionalExpression = (
          expression: TSESTree.ConditionalExpression
        ) => {
          if (expression.consequent.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(
              expression.consequent.value,
              expression.consequent
            );
          }
          if (expression.alternate.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(
              expression.alternate.value,
              expression.alternate
            );
          }
          if (expression.consequent.type === AST_NODE_TYPES.TemplateLiteral) {
            checkTemplateLiteralQuasisSpaces(expression.consequent.quasis);
            checkTemplateLiteralExpressionsSpaces(
              expression.consequent.expressions
            );
          }
          if (expression.alternate.type === AST_NODE_TYPES.TemplateLiteral) {
            checkTemplateLiteralQuasisSpaces(expression.alternate.quasis);
            checkTemplateLiteralExpressionsSpaces(
              expression.alternate.expressions
            );
          }
          if (
            expression.consequent.type === AST_NODE_TYPES.ConditionalExpression
          ) {
            checkConditionalExpression(expression.consequent);
          }
          if (
            expression.alternate.type === AST_NODE_TYPES.ConditionalExpression
          ) {
            checkConditionalExpression(expression.alternate);
          }
          if (expression.consequent.type === AST_NODE_TYPES.LogicalExpression) {
            checkLogicalExpression(expression.consequent);
          }
          if (expression.alternate.type === AST_NODE_TYPES.LogicalExpression) {
            checkLogicalExpression(expression.alternate);
          }
          if (expression.consequent.type === AST_NODE_TYPES.BinaryExpression) {
            checkBinaryExpression(expression.consequent);
          }
          if (expression.alternate.type === AST_NODE_TYPES.BinaryExpression) {
            checkBinaryExpression(expression.alternate);
          }
        };

        const checkLogicalExpression = (
          expression: TSESTree.LogicalExpression
        ) => {
          if (expression.right.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(expression.right.value, expression.right);
          }
          if (expression.right.type === AST_NODE_TYPES.TemplateLiteral) {
            checkTemplateLiteralQuasisSpaces(expression.right.quasis);
            checkTemplateLiteralExpressionsSpaces(expression.right.expressions);
          }
          if (expression.right.type === AST_NODE_TYPES.ConditionalExpression) {
            checkConditionalExpression(expression.right);
          }
          if (expression.right.type === AST_NODE_TYPES.LogicalExpression) {
            checkLogicalExpression(expression.right);
          }
          if (expression.right.type === AST_NODE_TYPES.BinaryExpression) {
            checkBinaryExpression(expression.right);
          }
        };

        const checkBinaryExpression = (
          expression: TSESTree.BinaryExpression
        ) => {
          if (expression.left.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(expression.left.value, expression.left);
          }
          if (expression.right.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(expression.right.value, expression.right);
          }
          if (expression.left.type === AST_NODE_TYPES.TemplateLiteral) {
            checkTemplateLiteralQuasisSpaces(expression.left.quasis);
            checkTemplateLiteralExpressionsSpaces(expression.left.expressions);
          }
          if (expression.right.type === AST_NODE_TYPES.TemplateLiteral) {
            checkTemplateLiteralQuasisSpaces(expression.right.quasis);
            checkTemplateLiteralExpressionsSpaces(expression.right.expressions);
          }
          if (expression.left.type === AST_NODE_TYPES.ConditionalExpression) {
            checkConditionalExpression(expression.left);
          }
          if (expression.right.type === AST_NODE_TYPES.ConditionalExpression) {
            checkConditionalExpression(expression.right);
          }
          if (expression.left.type === AST_NODE_TYPES.LogicalExpression) {
            checkLogicalExpression(expression.left);
          }
          if (expression.right.type === AST_NODE_TYPES.LogicalExpression) {
            checkLogicalExpression(expression.right);
          }
          if (expression.left.type === AST_NODE_TYPES.BinaryExpression) {
            checkBinaryExpression(expression.left);
          }
          if (expression.right.type === AST_NODE_TYPES.BinaryExpression) {
            checkBinaryExpression(expression.right);
          }
        };

        const isClassName = node.name.name === "className";
        const attributeValue = node.value;

        if (isClassName && attributeValue) {
          if (attributeValue.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(attributeValue.value, attributeValue);
          }

          if (attributeValue.type === AST_NODE_TYPES.JSXExpressionContainer) {
            const expression = attributeValue.expression;

            if (expression.type === AST_NODE_TYPES.Literal) {
              checkLiteralValueSpaces(expression.value, expression);
            }

            if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
              checkTemplateLiteralQuasisSpaces(expression.quasis);
              checkTemplateLiteralExpressionsSpaces(expression.expressions);
            }

            if (expression.type === AST_NODE_TYPES.ConditionalExpression) {
              checkConditionalExpression(expression);
            }

            if (expression.type === AST_NODE_TYPES.LogicalExpression) {
              checkLogicalExpression(expression);
            }

            if (expression.type === AST_NODE_TYPES.BinaryExpression) {
              checkBinaryExpression(expression);
            }

            if (expression.type === AST_NODE_TYPES.CallExpression) {
              expression.arguments.forEach((argument) => {
                if (argument.type === AST_NODE_TYPES.Literal) {
                  checkLiteralValueSpaces(argument.value, argument);
                }

                if (argument.type === AST_NODE_TYPES.TemplateLiteral) {
                  checkTemplateLiteralQuasisSpaces(argument.quasis);
                  checkTemplateLiteralExpressionsSpaces(argument.expressions);
                }

                if (argument.type === AST_NODE_TYPES.ConditionalExpression) {
                  checkConditionalExpression(argument);
                }

                if (argument.type === AST_NODE_TYPES.LogicalExpression) {
                  checkLogicalExpression(argument);
                }

                if (argument.type === AST_NODE_TYPES.BinaryExpression) {
                  checkBinaryExpression(argument);
                }
              });
            }
          }
        }
      },
    };
  },
});
