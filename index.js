'use strict';
var once = require('once');
var setups;

exports.setups = function (fns) {
	setups = fns.map(function (fn) {
		return once(fn);
	});
};

exports.preparing = function (n) {
	for (var i = 0; i < setups.length && i < n; i++) {
		setups[i]();
	}
};
