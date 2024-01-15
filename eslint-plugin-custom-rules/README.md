## Eslint plugin for linting and formatting spaces in className

Supports a lot of cases, including combined and tw-merge library

## Quick start:

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

## Usage
Before plugin autofix:
```bash
<div>
    <p className=" class1   class2 class3  ">Not empty literal className</p>
    <div
        className={
          "  z-10    items-center  justify-between   " +
          (true ? " text-center " + "  class" : "text-right  ") +
          (false && " text-clip text-ref")
        }
    >Combined className expression</div>
    <p
    className={twMerge(
      "text-nowrap  text-yellow-600  ",
      ` font-semibold   text-green`,
      true &&
        (!false
          ? `${true ? `  whitespace-normal` : "  class1  class2"}  text-red-50`
          : "   text-green-50 "),
      false ? "  text-red-50 " : "  text-green-50  "
    )}
  >
    TwMerge combined className
  </p>
</div>
```
After plugin autofix:
```bash
<div>
    <p className="class1 class2 class3">Not empty literal className</p>
    <div
        className={
          "z-10 items-center justify-between" +
          (true ? "text-center" + "class" : "text-right") +
          (false && "text-clip text-ref")
        }
    >Combined className expression</div>
    <p
    className={twMerge(
      "text-nowrap text-yellow-600",
      `font-semibold text-green`,
      true &&
        (!false
          ? `${true ? `whitespace-normal` : "class1 class2"} text-red-50`
          : "text-green-50"),
      false ? "text-red-50" : "text-green-50"
    )}
  >
    TwMerge combined className
  </p>
</div>
```
