module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: ["eslint:recommended", "airbnb-base"],
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "comma-dangle": ["error", "never"],
        "no-console": "off",
        "class-methods-use-this": "off",
        "import/extensions": [
            "error",
            "ignorePackages",
            {
                js: "never"
            }
        ],
        "import/no-extraneous-dependencies": [
            "error",
            {
                devDependencies: true
            }
        ],
        "import/prefer-default-export": "off",
        indent: ["error", 2],
        "object-curly-spacing": ["error", "always"],
        "array-bracket-spacing": ["error", "always"],
        "arrow-spacing": ["error", { before: true, after: true }],
        "space-before-blocks": ["error", "always"],
        "keyword-spacing": ["error", { before: true, after: true }]
    }
};
