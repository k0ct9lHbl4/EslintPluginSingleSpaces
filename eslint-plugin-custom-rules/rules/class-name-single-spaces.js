var LITERAL = "Literal";
var TEMPLATE_LITERAL = "TemplateLiteral";
var JSX_EXPRESSION_CONTAINER = "JSXExpressionContainer";
var CONDITIONAL_EXPRESSION = "ConditionalExpression";
var LOGICAL_EXPRESSION = "LogicalExpression";
var BINARY_EXPRESSION = "BinaryExpression";
var CALL_EXPRESSION = "CallExpression";

module.exports = {
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
          function checkType(node, skipCheckCornerSpaces = false) {
            function checkValueSpaces(value) {
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

                if (/^\s+|\s+$/gm.test(value) && !skipCheckCornerSpaces) {
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

            if (node.type === LITERAL) {
              checkValueSpaces(node.value);
            } else if (node.type === TEMPLATE_LITERAL) {
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
            } else if (node.type === JSX_EXPRESSION_CONTAINER) {
              checkType(node.expression);
            } else if (node.type === CONDITIONAL_EXPRESSION) {
              checkType(node.consequent);
              checkType(node.alternate);
            } else if (node.type === LOGICAL_EXPRESSION) {
              checkType(node.right);
            } else if (node.type === BINARY_EXPRESSION) {
              checkType(node.left, true);
              checkType(node.right, true);
            } else if (node.type === CALL_EXPRESSION) {
              node.arguments.forEach((argument) => checkType(argument));
            }
          }

          checkType(node.value);
        }
      },
    };
  },
};
