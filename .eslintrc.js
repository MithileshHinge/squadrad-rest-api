module.exports = {
    "extends": "airbnb-base",
    "plugins": [
        "import"
    ],
    "rules": {
        "arrow-parens": [
            "error",
            "always"
        ],
        "no-console": process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        "no-debugger": process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        "indent": [2, "tab"],
        "no-tabs": 0,
        "max-len": 0
    },
    "env": {
        "jest": true
    }
}
