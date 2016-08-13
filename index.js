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
	var context = {};

	this.setups = function (_fns_) {
		fns = _fns_;
		setups = toOnce(fns);
	};

	this.preparing = function (n) {
		if (N > n) {
			if (teardown) {
				setups = toOnce(fns);
				teardown();
			} else {
				throw new Error('You have some extra setups that you don\'t need for this test block.\nProvide a teardown function with `tearsWithJoy` to clean up all the setups');
			}
		}

		for (var i = 0; i < setups.length && i < n; i++) {
			setups[i](context);
		}

		N = n;

		return context;
	};

	this.tearsWithJoy = function (fn) {
		teardown = fn;
	};
};
