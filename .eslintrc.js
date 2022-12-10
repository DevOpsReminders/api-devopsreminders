module.exports = {
    env: {
        node: true,
    },
    overrides: [],
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        // 'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:prettier/recommended',
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: '12',
        sourceType: 'module',
    },
    rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        'prettier/prettier': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'type'],
    },
};
