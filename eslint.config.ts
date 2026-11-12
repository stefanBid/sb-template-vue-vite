// ESLint flat config — https://eslint.vuejs.org/user-guide/ · https://github.com/vuejs/eslint-config-typescript
import stylistic from '@stylistic/eslint-plugin'
import { defineConfigWithVueTs, vueTsConfigs } from '@vue/eslint-config-typescript'
import { globalIgnores } from 'eslint/config'
import pluginVue from 'eslint-plugin-vue'

export default defineConfigWithVueTs(
  // ============================================================
  // 🔹 Files & ignored paths
  // ============================================================
  {
    name: 'app/files-to-lint',
    files: ['**/*.{ts,mts,vue}'],
  },

  globalIgnores([
    '**/dist/**',
    '**/coverage/**',
    'public/**',
    '.vscode/**',
    '.idea/**',
  ]),

  // ============================================================
  // 🔹 Shared presets
  // ============================================================
  ...pluginVue.configs['flat/recommended'],
  vueTsConfigs.recommended,

  // Formatting: 2 spaces, single quotes, no semicolons, trailing commas, stroustrup braces
  // https://eslint.style/guide/config-presets
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    commaDangle: 'always-multiline',
    braceStyle: 'stroustrup',
  }),

  // ============================================================
  // 🔹 Project rules
  // ============================================================
  {
    name: 'app/rules',
    rules: {
      // ------------------------------------------------------------
      // 🧩 Code Quality
      // ------------------------------------------------------------
      // console.warn / console.error stay allowed: the global error handler reports through them
      'no-console': [process.env.NODE_ENV === 'production' ? 'error' : 'warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // Module augmentation (vue-i18n, vue-router) extends an existing interface without adding members
      '@typescript-eslint/no-empty-object-type': ['error', { allowInterfaces: 'with-single-extends' }],
      'eqeqeq': 'error',
      'curly': 'error',

      // ------------------------------------------------------------
      // 🎨 Style & Readability
      // ------------------------------------------------------------
      '@stylistic/object-curly-spacing': ['warn', 'always'],
      '@stylistic/object-curly-newline': ['warn', { multiline: true, consistent: true }],
      '@stylistic/object-property-newline': ['warn', { allowAllPropertiesOnSameLine: true }],
      '@stylistic/array-bracket-spacing': ['warn', 'never'],
      '@stylistic/space-before-blocks': ['warn', 'always'],
      '@stylistic/keyword-spacing': ['warn', { before: true, after: true }],
      '@stylistic/space-infix-ops': 'warn',
      '@stylistic/eol-last': ['error', 'always'],

      // ------------------------------------------------------------
      // 🧱 Vue Specific Formatting
      // ------------------------------------------------------------
      'vue/multi-word-component-names': 'off',
      // v-html is allowed only through BaseRichText, which sanitizes its input
      'vue/no-v-html': 'off',

      'vue/html-indent': ['warn', 2, {
        attribute: 1,
        baseIndent: 1,
        closeBracket: 0,
        alignAttributesVertically: true,
      }],

      'vue/script-indent': ['warn', 2, {
        baseIndent: 0,
        switchCase: 1,
        ignores: [],
      }],

      'vue/first-attribute-linebreak': ['warn', {
        singleline: 'ignore',
        multiline: 'below',
      }],

      'vue/max-attributes-per-line': ['warn', {
        singleline: 3,
        multiline: 1,
      }],

      'vue/attributes-order': ['warn', { alphabetical: true }],

      'vue/html-self-closing': ['warn', {
        html: { void: 'always', normal: 'never', component: 'always' },
        svg: 'always',
        math: 'always',
      }],

      'vue/block-tag-newline': ['warn', {
        singleline: 'always',
        multiline: 'always',
        maxEmptyLines: 0,
      }],

      'vue/multiline-html-element-content-newline': ['warn', {
        ignoreWhenEmpty: true,
        allowEmptyLines: false,
      }],
    },
  },
)
