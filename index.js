'use strict';
/* eslint no-var: 0, prefer-arrow-callback: */
var once = require('once');

module.exports = function BetterThanBefore() {
	if (!(this instanceof BetterThanBefore)) {
		return new BetterThanBefore();
	}

	var setups;

	this.setups = function (fns) {
		setups = fns.map(function (fn) {
			return once(fn);
		});
	};

	this.preparing = function (n) {
		for (var i = 0; i < setups.length && i < n; i++) {
			setups[i]();
		}
	};
};
