import { ESLintUtils, AST_NODE_TYPES, TSESTree } from "@typescript-eslint/utils";

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
        const checkLiteralValueSpaces = (value: unknown, errorNode: TSESTree.Node) => {
          if (value && typeof value === "string") {
            if (/\s\s/gm.test(value)) {
              context.report({
                node: errorNode,
                messageId: "classNameSingleSpaces",
                fix(fixer) {
                  return fixer.replaceText(
                    errorNode,
                    context.getSourceCode().getText(errorNode).replace(/\s+/gm, " ")
                  );
                },
              });
            }
            if (/^\s+|\s+$/gm.test(value)) {
              context.report({
                node: errorNode,
                messageId: "cornerCharactersSpaces",
                fix(fixer) {
                  const sourceNodeText = context.getSourceCode().getText(errorNode);
                  const newNodeText =
                    sourceNodeText[0] +
                    sourceNodeText
                      .slice(1, sourceNodeText.length - 1)
                      .replace(/\s+/gm, " ")
                      .replace(/^\s+|\s+$/gm, "") +
                    sourceNodeText[sourceNodeText.length - 1];

                  return fixer.replaceText(errorNode, newNodeText);
                },
              });
            }
          }
        };

        const checkTemplateLiteralQuasisSpaces = (quasis: TSESTree.TemplateElement[]) => {
          if (quasis.length === 1 && quasis[0]) {
            checkLiteralValueSpaces(quasis[0].value.raw, quasis[0]);
            return;
          }

          quasis.forEach((templateElement) => {
            const value = templateElement.value.raw;
            if (value === " " || value === "  ") {
              checkLiteralValueSpaces(value, templateElement);
            } else {
              checkLiteralValueSpaces(value.slice(1, value.length - 1), templateElement);
            }
          });
        };
        const checkTemplateLiteralExpressionsSpaces = (expressions: TSESTree.Expression[]) => {
          expressions.forEach((expression) => {
            if (expression.type === AST_NODE_TYPES.Literal) {
              checkLiteralValueSpaces(expression.value, expression);
            } else if (expression.type === AST_NODE_TYPES.ConditionalExpression) {
              checkConditionalExpression(expression);
            } else if (expression.type === AST_NODE_TYPES.LogicalExpression) {
              checkLogicalExpression(expression);
            } else if (expression.type === AST_NODE_TYPES.BinaryExpression) {
              checkBinaryExpression(expression);
            }
          });
        };

        const checkConditionalExpression = (expression: TSESTree.ConditionalExpression) => {
          const { consequent, alternate } = expression;

          if (consequent.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(consequent.value, consequent);
          } else if (consequent.type === AST_NODE_TYPES.TemplateLiteral) {
            checkTemplateLiteralQuasisSpaces(consequent.quasis);
            checkTemplateLiteralExpressionsSpaces(consequent.expressions);
          } else if (consequent.type === AST_NODE_TYPES.ConditionalExpression) {
            checkConditionalExpression(consequent);
          } else if (consequent.type === AST_NODE_TYPES.LogicalExpression) {
            checkLogicalExpression(consequent);
          } else if (consequent.type === AST_NODE_TYPES.BinaryExpression) {
            checkBinaryExpression(consequent);
          }

          if (alternate.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(alternate.value, alternate);
          } else if (alternate.type === AST_NODE_TYPES.TemplateLiteral) {
            checkTemplateLiteralQuasisSpaces(alternate.quasis);
            checkTemplateLiteralExpressionsSpaces(alternate.expressions);
          } else if (alternate.type === AST_NODE_TYPES.ConditionalExpression) {
            checkConditionalExpression(alternate);
          } else if (alternate.type === AST_NODE_TYPES.LogicalExpression) {
            checkLogicalExpression(alternate);
          } else if (alternate.type === AST_NODE_TYPES.BinaryExpression) {
            checkBinaryExpression(alternate);
          }
        };

        const checkLogicalExpression = (expression: TSESTree.LogicalExpression) => {
          const { right: rightPart } = expression;

          if (rightPart.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(rightPart.value, rightPart);
          } else if (rightPart.type === AST_NODE_TYPES.TemplateLiteral) {
            checkTemplateLiteralQuasisSpaces(rightPart.quasis);
            checkTemplateLiteralExpressionsSpaces(rightPart.expressions);
          } else if (rightPart.type === AST_NODE_TYPES.ConditionalExpression) {
            checkConditionalExpression(rightPart);
          } else if (rightPart.type === AST_NODE_TYPES.LogicalExpression) {
            checkLogicalExpression(rightPart);
          } else if (rightPart.type === AST_NODE_TYPES.BinaryExpression) {
            checkBinaryExpression(rightPart);
          }
        };

        const checkBinaryExpression = (expression: TSESTree.BinaryExpression) => {
          const { left: leftPart, right: rightPart } = expression;

          if (leftPart.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(leftPart.value, leftPart);
          } else if (leftPart.type === AST_NODE_TYPES.TemplateLiteral) {
            checkTemplateLiteralQuasisSpaces(leftPart.quasis);
            checkTemplateLiteralExpressionsSpaces(leftPart.expressions);
          } else if (leftPart.type === AST_NODE_TYPES.ConditionalExpression) {
            checkConditionalExpression(leftPart);
          } else if (leftPart.type === AST_NODE_TYPES.LogicalExpression) {
            checkLogicalExpression(leftPart);
          } else if (leftPart.type === AST_NODE_TYPES.BinaryExpression) {
            checkBinaryExpression(leftPart);
          }

          if (rightPart.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(rightPart.value, rightPart);
          } else if (rightPart.type === AST_NODE_TYPES.TemplateLiteral) {
            checkTemplateLiteralQuasisSpaces(rightPart.quasis);
            checkTemplateLiteralExpressionsSpaces(rightPart.expressions);
          } else if (rightPart.type === AST_NODE_TYPES.ConditionalExpression) {
            checkConditionalExpression(rightPart);
          } else if (rightPart.type === AST_NODE_TYPES.LogicalExpression) {
            checkLogicalExpression(rightPart);
          } else if (rightPart.type === AST_NODE_TYPES.BinaryExpression) {
            checkBinaryExpression(rightPart);
          }
        };

        const isClassName = node.name.name === "className";
        const attributeValue = node.value;

        if (isClassName && attributeValue) {
          if (attributeValue.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(attributeValue.value, attributeValue);
          } else if (attributeValue.type === AST_NODE_TYPES.JSXExpressionContainer) {
            const expression = attributeValue.expression;

            if (expression.type === AST_NODE_TYPES.Literal) {
              checkLiteralValueSpaces(expression.value, expression);
            } else if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
              checkTemplateLiteralQuasisSpaces(expression.quasis);
              checkTemplateLiteralExpressionsSpaces(expression.expressions);
            } else if (expression.type === AST_NODE_TYPES.ConditionalExpression) {
              checkConditionalExpression(expression);
            } else if (expression.type === AST_NODE_TYPES.LogicalExpression) {
              checkLogicalExpression(expression);
            } else if (expression.type === AST_NODE_TYPES.BinaryExpression) {
              checkBinaryExpression(expression);
            } else if (expression.type === AST_NODE_TYPES.CallExpression) {
              expression.arguments.forEach((argument) => {
                if (argument.type === AST_NODE_TYPES.Literal) {
                  checkLiteralValueSpaces(argument.value, argument);
                } else if (argument.type === AST_NODE_TYPES.TemplateLiteral) {
                  checkTemplateLiteralQuasisSpaces(argument.quasis);
                  checkTemplateLiteralExpressionsSpaces(argument.expressions);
                } else if (argument.type === AST_NODE_TYPES.ConditionalExpression) {
                  checkConditionalExpression(argument);
                } else if (argument.type === AST_NODE_TYPES.LogicalExpression) {
                  checkLogicalExpression(argument);
                } else if (argument.type === AST_NODE_TYPES.BinaryExpression) {
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
