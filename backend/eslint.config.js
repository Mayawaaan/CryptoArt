import { createRequire } from 'node:module'
import { pathToFileURL } from 'node:url'

const frontendRequire = createRequire(new URL('../frontend/package.json', import.meta.url))
const loadFromFrontend = async (specifier) => {
  const mod = await import(pathToFileURL(frontendRequire.resolve(specifier)).href)
  return mod.default ?? mod
}

const js = await loadFromFrontend('@eslint/js')
const globals = await loadFromFrontend('globals')
const { defineConfig, globalIgnores } = await import(
  pathToFileURL(frontendRequire.resolve('eslint/config')).href
)

export default defineConfig([
  globalIgnores(['node_modules']),
  {
    files: ['**/*.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]', argsIgnorePattern: '^_' }],
    },
  },
])
