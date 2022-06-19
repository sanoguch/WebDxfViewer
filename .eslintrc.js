module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: [
    "eslint:recommended",
    // TypeScriptでチェックされる項目をLintから除外する設定
    "plugin:@typescript-eslint/recommended", 
    // prettierのextendsは他のextendsより後に記述する
    "prettier", 
    // 2021-02-21から記述不要
    // "prettier/@typescript-eslint",
  ],
  plugins: [
    "@typescript-eslint"
  ],
  // ESLintでTypescriptを解析する
  parser: "@typescript-eslint/parser",
  parserOptions: {
    "sourceType": "module",
    // TypeScriptのLint時に参照するconfigファイルを指定
    "project": "./tsconfig.json" 
  },
  // 上位ディレクトリにある親のeslintrcを参照しないようにする
  root: true, 
  // https://stackoverflow.com/questions/68802881/get-rid-of-is-defined-but-never-used-in-function-parameter
  rules: {
    "no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
  }
}
