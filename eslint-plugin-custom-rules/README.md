## Eslint plugin for linting and formatting spaces in className

Supports a lot of cases, including combined and tw-merge library

# Quick start:

```bash
npm i -D eslint-plugin-class-name-single-spaces
```

Firstly, add to .eslintrc plugins array

```bash
"class-name-single-spaces"
```

Secondary, add to .eslintrc rules object

```bash
"class-name-single-spaces/class-name-single-spaces": "error"
```

Finally, restart ESLint Server of IDE

## You can use this general .eslintrc.js config

```bash
module.exports  = {
	extends: ["plugin:@typescript-eslint/recommended"],
	plugins: ["class-name-single-spaces"],
	rules: {
		"class-name-single-spaces/class-name-single-spaces": "error",
	},
	ignorePatterns: ["node_modules", ".eslintrc.js"],
};
```