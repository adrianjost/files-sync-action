import * as core from "@actions/core";
import main from "./src/index.js";

main().catch((error) => {
	core.setFailed(`Action failed with error ${error}`);
});
