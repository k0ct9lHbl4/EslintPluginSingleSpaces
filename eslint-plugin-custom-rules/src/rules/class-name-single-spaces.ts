import { ESLintUtils, AST_NODE_TYPES } from "@typescript-eslint/utils";

export const classNameSingleSpacesRule = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "layout",
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
        const checkLiteralValueSpaces = (value: unknown) => {
          if (value && typeof value === "string") {
            if (value.includes("  ")) {
              context.report({ node, messageId: "classNameSingleSpaces" });
            }
            if (value.endsWith(" ") || value.startsWith(" ")) {
              context.report({ node, messageId: "cornerCharactersSpaces" });
            }
          }
        };

        const checkTemplateLiteralQuasisSpaces = (quasis: any[]) => {
          const notEmptyTemplateElements: string[] = [];

          if (quasis.length === 1) {
            if (quasis[0]) checkLiteralValueSpaces(quasis[0].value.raw);
            return;
          }

          quasis.forEach((templateElement: any) => {
            const value = templateElement.value.raw;
            if (value === " " || value === "  ") {
              checkLiteralValueSpaces(value);
              return;
            }
            const trimmedValue = value.slice(1, value.length - 1);
            if (trimmedValue) {
              notEmptyTemplateElements.push(trimmedValue);
            }
          });

          notEmptyTemplateElements.forEach((templateElement) => {
            checkLiteralValueSpaces(templateElement);
          });
        };
        const checkTemplateLiteralExpressionsSpaces = (expressions: any[]) => {
          expressions.forEach((expression) => {
            if (expression.type === AST_NODE_TYPES.Literal) {
              checkLiteralValueSpaces(expression);
            }
            if (expression.type === AST_NODE_TYPES.ConditionalExpression) {
              checkConditionalExpression(expression);
            }
            if (expression.type === AST_NODE_TYPES.LogicalExpression) {
              checkLogicalExpression(expression);
            }
          });
        };

        const checkConditionalExpression = (expression: any) => {
          if (expression.consequent.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(expression.consequent.value);
          }
          if (expression.alternate.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(expression.alternate.value);
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
        };

        const checkLogicalExpression = (expression: any) => {
          if (expression.right.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(expression.right.value);
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
        };

        const isClassName = node.name.name === "className";
        const attributeValue = node.value;

        if (isClassName && attributeValue) {
          if (attributeValue.type === AST_NODE_TYPES.Literal) {
            checkLiteralValueSpaces(attributeValue.value);
          }

          if (attributeValue.type === AST_NODE_TYPES.JSXExpressionContainer) {
            const expression = attributeValue.expression;

            if (expression.type === AST_NODE_TYPES.Literal) {
              checkLiteralValueSpaces(expression.value);
            }

            if (expression.type === AST_NODE_TYPES.TemplateLiteral) {
              checkTemplateLiteralQuasisSpaces(expression.quasis);
              checkTemplateLiteralExpressionsSpaces(expression.expressions);
            }

            if (expression.type === AST_NODE_TYPES.CallExpression) {
              expression.arguments.forEach((argument) => {
                if (argument.type === AST_NODE_TYPES.Literal) {
                  checkLiteralValueSpaces(argument.value);
                }

                if (argument.type === AST_NODE_TYPES.TemplateLiteral) {
                  checkTemplateLiteralQuasisSpaces(argument.quasis);
                  checkTemplateLiteralExpressionsSpaces(argument.expressions);
                }

                if (argument.type === AST_NODE_TYPES.LogicalExpression) {
                  checkLogicalExpression(argument);
                }

                if (argument.type === AST_NODE_TYPES.ConditionalExpression) {
                  checkConditionalExpression(argument);
                }
              });
            }
          }
        }
      },
    };
  },
});
