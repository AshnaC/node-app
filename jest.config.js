module.exports = {
	transform: {
		"^.+\\.jsx?$": "babel-jest"
	},
	moduleFileExtensions: ["js", "jsx"],
	moduleNameMapper: {
		'\\.(css|less|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/src_client/tests/__mocks__/styleMock.js'
	},
	coveragePathIgnorePatterns: ["/node_modules/", "/target/", "/nls/"],
	modulePathIgnorePatterns: ["__mocks__"],
	testMatch: ["**/tests/**/*.js?(x)"],
	coverageDirectory: "<rootDir>/WebinstallerUIComponents/coverage",
	setupFilesAfterEnv: ["<rootDir>/src_client/testUtils.js"]
};
