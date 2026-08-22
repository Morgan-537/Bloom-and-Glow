// Named .cjs for the same reason as babel.config.cjs — package.json has
// "type": "module", and Jest's own config loader needs plain CommonJS here.
module.exports = {
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  moduleNameMapper: {
    // Vite lets components import images/CSS directly; Jest needs those
    // swapped for harmless stubs so a component test doesn't fail trying
    // to parse a .png or .css file as JavaScript.
    "\\.(css|less|scss|sass)$": "<rootDir>/src/test/styleMock.cjs",
    "\\.(jpg|jpeg|png|gif|webp|svg)$": "<rootDir>/src/test/fileMock.cjs",
  },
  testPathIgnorePatterns: ["<rootDir>/node_modules/"],
  clearMocks: true,
};
