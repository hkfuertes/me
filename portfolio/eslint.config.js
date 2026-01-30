import eslintPluginAstro from 'eslint-plugin-astro';

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    ignores: [
      '.astro/**',
      'dist/**',
      'node_modules/**',
    ],
  },
  {
    rules: {
      // Customize your rules here
      'no-unused-vars': 'warn',
      'no-console': 'off',
    },
  },
];
