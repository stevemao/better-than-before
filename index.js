'use strict';
/* eslint no-var: 0, prefer-arrow-callback: */
var once = require('once');

function toOnce(fns) {
	return fns.map(function (fn) {
		fn.called = false;
		return once(fn);
	});
}

module.exports = function BetterThanBefore() {
	if (!(this instanceof BetterThanBefore)) {
		return new BetterThanBefore();
	}

	var setups;
	var teardown;
	var fns;
	var N = 0;

	this.setups = function (_fns_) {
		fns = _fns_;
		setups = toOnce(fns);
	};

	this.preparing = function (n) {
		if (N > n) {
			setups = toOnce(fns);
			teardown();
		}

		for (var i = 0; i < setups.length && i < n; i++) {
			setups[i]();
		}

		N = n;
	};

	this.tearsWithJoy = function (fn) {
		teardown = fn;
	};
};
