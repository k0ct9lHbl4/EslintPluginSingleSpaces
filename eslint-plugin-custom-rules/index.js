const classNameSingleSpacesRule = require("./rules/class-name-single-spaces");

const plugin = {
  rules: {
    "class-name-single-spaces": classNameSingleSpacesRule,
  },
};

module.exports = plugin;
