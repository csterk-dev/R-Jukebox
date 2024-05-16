module.exports = {
  extends: ["plugin:react/jsx-runtime"],

  env: {
    es6: true
  },

  parserOptions: {
    sourceType: "module"
  },

  plugins: [
    "eslint-comments",
    "react",
    "react-hooks",
    "jest",
    "@typescript-eslint"
  ],

  settings: {
    react: {
      version: "detect"
    }
  },

  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint/eslint-plugin"],
      rules: {
        "@typescript-eslint/no-unused-vars": [
          "warn",
          {
            argsIgnorePattern: "^_+",
            vars: "local"
          }
        ],
        "no-unused-vars": "off",
        "no-shadow": "off",
        "@typescript-eslint/no-shadow": 2,
        "no-undef": "off",
        "func-call-spacing": "off",
        "no-redeclare": "off",
        "@typescript-eslint/no-redeclare": ["error", { ignoreDeclarationMerge: true }],
        "@typescript-eslint/func-call-spacing": 1
      }
    },
    {
      files: [
        "*.{spec,test}.{js,ts,tsx}",
        "**/__{mocks,tests}__/**/*.{js,ts,tsx}"
      ],
      env: {
        jest: true,
        "jest/globals": true
      },
      rules: {
        quotes: [
          1, "single", {
            avoidEscape: true,
            allowTemplateLiterals: true
          }
        ]
      }
    }
  ],

  globals: {
    __DEV__: true,
    __dirname: false,
    __fbBatchedBridgeConfig: false,
    AbortController: false,
    Blob: true,
    alert: false,
    cancelAnimationFrame: false,
    cancelIdleCallback: false,
    clearImmediate: true,
    clearInterval: false,
    clearTimeout: false,
    console: false,
    document: false,
    ErrorUtils: false,
    escape: false,
    Event: false,
    EventTarget: false,
    exports: false,
    fetch: false,
    File: true,
    FileReader: false,
    FormData: false,
    global: false,
    Headers: false,
    Intl: false,
    Map: true,
    module: false,
    navigator: false,
    process: false,
    Promise: true,
    requestAnimationFrame: true,
    requestIdleCallback: true,
    require: false,
    Set: true,
    setImmediate: true,
    setInterval: false,
    setTimeout: false,
    queueMicrotask: true,
    URL: false,
    URLSearchParams: false,
    WebSocket: true,
    window: false,
    XMLHttpRequest: false
  },

  rules: {
    "array-bracket-newline": "error",
    "arrow-spacing": "warn",
    "block-spacing": "warn",
    "brace-style": "warn",
    "comma-dangle": ["error", "never"],
    "comma-spacing": "warn",
    "comma-style": "warn",
    "computed-property-spacing": "warn",
    "dot-location": ["warn", "property"],
    curly: "off",
    "eol-last": "off",
    "function-call-argument-newline": ["warn", "consistent"],
    "function-paren-newline": ["warn", "consistent"],
    "func-call-spacing": "warn",
    "func-name-matching": "error",
    indent: ["error", 2, { SwitchCase: 1 }],
    "jsx-quotes": ["error", "prefer-double"],
    "lines-around-comment": "off",
    "multiline-comment-style": ["off"],
    "newline-per-chained-call": "error",
    "no-async-promise-executor": "warn",
    "no-await-in-loop": "warn",
    "no-case-declarations": "error",
    "no-constant-binary-expression": "error",
    "no-dupe-args": "error",
    "no-dupe-else-if": "warn",
    "no-duplicate-case": "error",
    "no-duplicate-imports": "error",
    "no-else-return": "warn",
    "no-empty": "error",
    "no-extra-semi": "warn",
    "no-fallthrough": "off",
    "no-inline-comments": "warn",
    "no-labels": "error",
    "no-lonely-if": "warn",
    "no-multi-spaces": "warn",
    "no-multiple-empty-lines": ["warn", { max: 3 }],
    "no-param-reassign": "error",
    "no-shadow": "error",
    "no-trailing-spaces": "off",
    "no-unsafe-finally": "error",
    "no-unsafe-optional-chaining": "error",
    "no-useless-catch": "error",
    "no-useless-return": "error",
    "no-var": "error",
    "no-whitespace-before-property": "warn",
    "object-curly-newline": [
      "error",
      {
        ObjectExpression: {
          consistent: true,
          minProperties: 2,
          multiline: true
        },
        ObjectPattern: { consistent: true },
        ImportDeclaration: "never",
        ExportDeclaration: { multiline: true }
      }
    ],
    "object-curly-spacing": ["error", "always"],
    "object-property-newline": "warn",
    "object-shorthand": "error",
    "operator-linebreak": [
      "warn",
      "none",
      {
        overrides: {
          "?": "after",
          ":": "after",
          "||": "before",
          "&&": "before",
          "??": "before",
          "+": "before",
          "=": "after"
        }
      }
    ],
    "padded-blocks": "off",
    "prefer-const": "warn",
    "prefer-template": "warn",
    quotes: ["error", "double"],
    "quote-props": ["warn", "as-needed"],
    "require-atomic-updates": "off",
    "require-await": "warn",
    "sort-imports": [
      "warn",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true
      }
    ],
    "space-before-blocks": "warn",
    "space-before-function-paren": [
      "warn",
      {
        anonymous: "never",
        asyncArrow: "always",
        named: "never"
      }
    ],
    "use-isnan": "error",
    "valid-typeof": "error",
    "wrap-iife": ["warn", "inside"],

    "react/boolean-prop-naming": "warn",
    "react/display-name": "warn",
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function"
      }
    ],
    "react/hook-use-state": "error",
    "react/no-array-index-key": "error",
    "react/no-children-prop": "error",
    "react/no-multi-comp": ["error", { ignoreStateless: true }],
    "react/no-unstable-nested-components": "error",
    "react/self-closing-comp": "error",
    "react/jsx-boolean-value": "warn",
    "react/jsx-closing-tag-location": "error",
    "react/jsx-curly-brace-presence": ["warn", "never"],
    "react/jsx-curly-spacing": "warn",
    "react/jsx-equals-spacing": "warn",
    "react/jsx-filename-extension": ["error", { extensions: [".jsx", ".tsx"] }],
    "react/jsx-first-prop-new-line": "warn",
    "react/jsx-handler-names": "off",
    "react/jsx-indent": [
      "error",
      2,
      {
        checkAttributes: true,
        indentLogicalExpressions: true
      }
    ],
    "react/jsx-indent-props": ["error", 2],
    "react/jsx-key": "error",
    "react/jsx-max-props-per-line": ["error", { maximum: 3 }],
    "react/jsx-no-comment-textnodes": "error",
    "react/jsx-no-duplicate-props": "error",
    "react/jsx-no-leaked-render": "error",
    "react/jsx-no-undef": "error",
    "react/jsx-no-useless-fragment": "warn",
    "react/jsx-one-expression-per-line": ["warn", { allow: "single-child" }],
    "react/jsx-pascal-case": "error",
    "react/jsx-props-no-multi-spaces": "warn",
    "react/jsx-sort-props": [
      "warn", {
        callbacksLast: true,
        shorthandLast: true,
        ignoreCase: true,
        reservedFirst: ["key"]
      }
    ],
    "react/jsx-tag-spacing": [
      "warn",
      {
        beforeClosing: "never"
      }
    ],
    "react/jsx-wrap-multilines": [
      "error",
      {
        declaration: "parens-new-line",
        assignment: "parens-new-line",
        return: "parens-new-line",
        arrow: "parens-new-line",
        condition: "ignore",
        logical: "ignore",
        prop: "ignore"
      }
    ],

    /*
     * React-Hooks Plugin
     * The following rules are made available via `eslint-plugin-react-hooks`
     */
    "react-hooks/rules-of-hooks": 2,
    "react-hooks/exhaustive-deps": 2,

    /*
     * Jest Plugin
     * The following rules are made available via `eslint-plugin-jest`.
     */
    "jest/no-disabled-tests": 1,
    "jest/no-focused-tests": 1,
    "jest/no-identical-title": 1,
    "jest/valid-expect": 1
  }
};