module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:@javascript-eslint/recommended',
        'prettier', // Добавьте 'prettier' в extends
    ],
    plugins: ['@javascript-eslint', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
    },
}
