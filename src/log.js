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

const logs = {};

module.exports = (id) => {
	logs[id] = [];

	const debug = (...attrs) => {
		logs[id].push(["debug", joinAttributes(...attrs)]);
		if (!id) {
			print();
		}
	};

	const error = (...attrs) => {
		logs[id].push(["error", joinAttributes(...attrs)]);
		core.setFailed(`Action failed with error ${joinAttributes(...attrs)}`);
		if (!id) {
			print();
		}
	};

	const info = (...attrs) => {
		logs[id].push(["info", joinAttributes(...attrs)]);
		if (!id) {
			print();
		}
	};

	const warn = (...attrs) => {
		logs[id].push(["warning", joinAttributes(...attrs)]);
		if (!id) {
			print();
		}
	};

	const _print = (id) => {
		logs[id].forEach(([type, content]) => {
			core[type](id !== "undefined" ? `${id}: ${content}` : content);
		});
		logs[id] = [];
	};

	const print = (_id = id) => {
		if (!_id) {
			Object.keys(logs).forEach((key) => {
				_print(key);
			});
		} else {
			_print(_id);
		}
	};

	return {
		debug,
		error,
		info,
		print,
		warn,
	};
};
