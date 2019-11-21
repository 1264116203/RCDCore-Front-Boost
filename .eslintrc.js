module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/recommended',
    '@vue/standard'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'space-before-function-paren': ['off', 'never'],
    'vue/max-attributes-per-line': ['error', { 'singleline': 100, 'multiline': { 'max': 100, 'allowFirstLine': true } }],
    'vue/html-self-closing': ['error', { 'html': { 'normal': 'any' } }]
  },
  parserOptions: {
    parser: 'babel-eslint'
  }
}
