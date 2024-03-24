module.exports = {
    env: {
        browser: true,
        es2021: true,
        node: true
    },
    extends: "eslint:recommended",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module"
    },
    rules: {
        semi: ["error", "always"],
        quotes: ["error", "double"],
        "comma-dangle": ["error", "never"],
        "no-console": "off"
    }
};
