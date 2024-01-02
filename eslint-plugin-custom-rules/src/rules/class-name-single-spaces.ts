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
        if (node.name.name === "className" && node.value !== null) {
          function checkType(node: TSESTree.Node) {
            function checkValueSpaces(value: unknown) {
              if (value && typeof value === "string") {
                if (/\s\s/gm.test(value)) {
                  context.report({
                    node,
                    messageId: "classNameSingleSpaces",
                    fix(fixer) {
                      return fixer.replaceText(
                        node,
                        context.getSourceCode().getText(node).replace(/\s+/gm, " ")
                      );
                    },
                  });
                }

                if (/^\s+|\s+$/gm.test(value)) {
                  context.report({
                    node,
                    messageId: "cornerCharactersSpaces",
                    fix(fixer) {
                      var sourceNodeText = context.getSourceCode().getText(node);
                      var newNodeText =
                        sourceNodeText[0] +
                        sourceNodeText
                          .slice(1, sourceNodeText.length - 1)
                          .replace(/\s+/gm, " ")
                          .replace(/^\s+|\s+$/gm, "") +
                        sourceNodeText[sourceNodeText.length - 1];

                      return fixer.replaceText(node, newNodeText);
                    },
                  });
                }
              }
            }

            if (node.type === AST_NODE_TYPES.Literal) {
              checkValueSpaces(node.value);
            } else if (node.type === AST_NODE_TYPES.TemplateLiteral) {
              if (node.quasis.length === 1 && node.quasis[0]) {
                checkValueSpaces(node.quasis[0].value.raw);
              } else {
                node.expressions.forEach((expression) => checkType(expression));
                node.quasis.forEach(({ value: { raw: value } }) => {
                  if (value === " " || value === "  ") {
                    checkValueSpaces(value);
                  } else {
                    checkValueSpaces(value.slice(1, value.length - 1));
                  }
                });
              }
            } else if (node.type === AST_NODE_TYPES.JSXExpressionContainer) {
              checkType(node.expression);
            } else if (node.type === AST_NODE_TYPES.ConditionalExpression) {
              checkType(node.consequent);
              checkType(node.alternate);
            } else if (node.type === AST_NODE_TYPES.LogicalExpression) {
              checkType(node.right);
            } else if (node.type === AST_NODE_TYPES.BinaryExpression) {
              checkType(node.left);
              checkType(node.right);
            } else if (node.type === AST_NODE_TYPES.CallExpression) {
              node.arguments.forEach((argument) => checkType(argument));
            }
          }

          checkType(node.value);
        }
      },
    };
  },
});
