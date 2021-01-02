const core = require("@actions/core");
try {
	// eslint-disable-next-line node/global-require
	require("./src/index")();
} catch (error) {
	core.setFailed(`Action failed with error ${error}`);
}
