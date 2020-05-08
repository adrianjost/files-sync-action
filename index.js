const core = require("@actions/core");
try {
	require("./src/index")();
} catch (error) {
	core.setFailed(`Action failed with error ${error}`);
}
