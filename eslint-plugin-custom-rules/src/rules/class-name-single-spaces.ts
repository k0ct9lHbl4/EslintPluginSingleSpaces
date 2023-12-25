import { ESLintUtils } from "@typescript-eslint/utils";

export const classNameSingleSpacesRule = ESLintUtils.RuleCreator.withoutDocs({
  meta: {
    type: "layout",
    messages: {
      classNameSingleSpaces: "Only single spaces should be used in className",
    },
    schema: [],
  },
  defaultOptions: [],
  create(context) {
    return {
      JSXAttribute(node) {
        const checkLiteralValueSpaces = (value: unknown) => {
          if (value && typeof value === "string") {
            if (
              value.startsWith(" ") ||
              value.endsWith(" ") ||
              value.includes("  ")
            ) {
              context.report({ node, messageId: "classNameSingleSpaces" });
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
            if (expression.type === "Literal") {
              checkLiteralValueSpaces(expression);
            }
            if (expression.type === "ConditionalExpression") {
              checkConditionalExpression(expression);
            }
            if (expression.type === "LogicalExpression") {
              checkLogicalExpression(expression);
            }
          });
        };

        const checkConditionalExpression = (expression: any) => {
          if (expression.consequent.type === "Literal") {
            checkLiteralValueSpaces(expression.consequent.value);
          }
          if (expression.alternate.type === "Literal") {
            checkLiteralValueSpaces(expression.alternate.value);
          }
          if (expression.consequent.type === "TemplateLiteral") {
            checkTemplateLiteralQuasisSpaces(expression.consequent.quasis);
            checkTemplateLiteralExpressionsSpaces(
              expression.consequent.expressions
            );
          }
          if (expression.alternate.type === "TemplateLiteral") {
            checkTemplateLiteralQuasisSpaces(expression.alternate.quasis);
            checkTemplateLiteralExpressionsSpaces(
              expression.alternate.expressions
            );
          }
          if (expression.consequent.type === "ConditionalExpression") {
            checkConditionalExpression(expression.consequent);
          }
          if (expression.alternate.type === "ConditionalExpression") {
            checkConditionalExpression(expression.alternate);
          }
        };

        const checkLogicalExpression = (expression: any) => {
          if (expression.right.type === "Literal") {
            checkLiteralValueSpaces(expression.right.value);
          }
          if (expression.right.type === "TemplateLiteral") {
            checkTemplateLiteralQuasisSpaces(expression.right.quasis);
            checkTemplateLiteralExpressionsSpaces(expression.right.expressions);
          }
          if (expression.right.type === "ConditionalExpression") {
            checkConditionalExpression(expression.right);
          }
          if (expression.right.type === "LogicalExpression") {
            checkLogicalExpression(expression.right);
          }
        };

        const isClassName = node.name.name === "className";
        const attributeValue = node.value;

        if (isClassName && attributeValue) {
          if (attributeValue.type === "Literal") {
            checkLiteralValueSpaces(attributeValue.value);
          }

          if (attributeValue.type === "JSXExpressionContainer") {
            const expression = attributeValue.expression;

            if (expression.type === "Literal") {
              checkLiteralValueSpaces(expression.value);
            }

            if (expression.type === "TemplateLiteral") {
              checkTemplateLiteralQuasisSpaces(expression.quasis);
              checkTemplateLiteralExpressionsSpaces(expression.expressions);
            }

            if (expression.type === "CallExpression") {
              expression.arguments.forEach((argument) => {
                if (argument.type === "Literal") {
                  checkLiteralValueSpaces(argument.value);
                }

                if (argument.type === "TemplateLiteral") {
                  checkTemplateLiteralQuasisSpaces(argument.quasis);
                  checkTemplateLiteralExpressionsSpaces(argument.expressions);
                }

                if (argument.type === "LogicalExpression") {
                  checkLogicalExpression(argument);
                }

                if (argument.type === "ConditionalExpression") {
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
