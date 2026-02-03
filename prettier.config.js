/** @type {import("prettier").Config} */
const config = {
  singleQuote: false, // " (double quote) 사용
  semi: true, // 세미콜론 사용
  useTabs: false, // 탭 대신 스페이스 사용
  tabWidth: 2, // 탭 너비 2
  trailingComma: "all", // 항상 후행 콤마 사용
  printWidth: 80, // 한 줄의 최대 너비
  arrowParens: "always", // 화살표 함수에서 괄호 항상 사용
  plugins: ["prettier-plugin-tailwindcss"], // Tailwind CSS 플러그인
};

export default config;
