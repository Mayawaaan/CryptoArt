import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const frontendRequire = createRequire(new URL('./frontend/package.json', import.meta.url))
const loadFromFrontend = async (specifier) => {
  const mod = await import(pathToFileURL(frontendRequire.resolve(specifier)).href)
  return mod.default ?? mod
}

const js = await loadFromFrontend('@eslint/js')
const globals = await loadFromFrontend('globals')
const reactHooks = await loadFromFrontend('eslint-plugin-react-hooks')
const reactRefresh = await loadFromFrontend('eslint-plugin-react-refresh')
const { defineConfig, globalIgnores } = await import(
  pathToFileURL(frontendRequire.resolve('eslint/config')).href
)

export default defineConfig([
  globalIgnores([
    'frontend/dist',
    'frontend/node_modules',
    'backend/node_modules',
    'contracts/node_modules',
    'contracts/artifacts',
    'contracts/cache',
    'contracts/typechain-types',
  ]),
  {
    files: ['frontend/src/**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^(?:[A-Z_]|motion$)' }],
    },
  },
  {
    files: ['backend/**/*.js', 'scripts/**/*.mjs'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^(?:[A-Z_]|motion$)' }],
    },
  },
  {
    files: ['contracts/**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^(?:[A-Z_]|motion$)' }],
    },
  },
])
