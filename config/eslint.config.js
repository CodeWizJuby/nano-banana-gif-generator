/**
 * ESLint configuration for nano Banana GIF Generator
 * Professional code quality standards
 */

export default [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly'
      }
    },
    rules: {
      // Code quality
      'no-unused-vars': 'error',
      'no-console': 'off', // Allow console for CLI app
      'no-debugger': 'error',
      'no-alert': 'error',
      
      // Best practices
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      
      // Style
      'indent': ['error', 2],
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      'eol-last': 'error',
      'no-trailing-spaces': 'error'
    }
  }
];
