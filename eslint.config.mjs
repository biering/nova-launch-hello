// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config/flat'

export default createConfigForNuxt({
  features: {
    /* stylistic: {
      semi: false,
      indent: 2,
      quotes: 'single',
    }, */
  },
}).append({
  rules: {
    'no-console': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    // TODO: fix
    '@typescript-eslint/no-unused-vars': 'warn',
  },
  ignores: [
    'node_modules',
    'dist',
    'types/supabase/generated.ts',
    'coverage/**/*.ts',
    'coverage/**/*.js',
    'coverage',
    '.output',
    '.nuxt',
    '.vercel',
  ],
})
