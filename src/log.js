const core = require("@actions/core");

const joinAttributes = (...attrs) =>
	attrs
		.map((p) =>
			Array.isArray(p) ||
			Object.prototype.toString.call(p) === "[object Object]"
				? JSON.stringify(p, undefined, 2)
				: p
		)
		.join(" ");

const debug = (...attrs) => {
	core.debug(joinAttributes(...attrs));
};

const error = (...attrs) => {
	core.error(joinAttributes(...attrs));
};

const info = (...attrs) => {
	core.info(joinAttributes(...attrs));
};

const warn = (...attrs) => {
	core.warning(joinAttributes(...attrs));
};
module.exports = {
	debug,
	error,
	info,
	warn,
};
