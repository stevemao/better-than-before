# better-than-before [![Build Status](https://travis-ci.org/stevemao/better-than-before.svg?branch=master)](https://travis-ci.org/stevemao/better-than-before) [![Coverage Status](https://coveralls.io/repos/github/stevemao/better-than-before/badge.svg?branch=master)](https://coveralls.io/github/stevemao/better-than-before?branch=master)

> Better setup for tests


## What's this?

I used to put the code for preparing each test in `before` or `setup` block, and clean it up in `after` or `teardown`. But what if the tests don't share the same setup? Easy, I can write something like this:

```js
test('A', () => {
	// preparing for test A
	...
});

test('B', () => {
	// preparing for test B
	...
});
```

But what if test B depends on test A:

```js
test('A', () => {
	// preparing for test A
	...
});

test('B', () => {
	// Also depend on "preparing for test A"
	// preparing for test B
	// but if A fails or skipped, the setup of B is not complete
	...
});
```

Normally this should work if tests are run synchronously. However, A lot of times I only want to run one test with grep. Or, if test A fails, test B also fails but it shouldn't. I was tempted to do something like this:

```js
beforeEach(() => {
	// testId indicates this setup is run immediately before which test
	if (testId === 'A') {
		// setup for test A
		...
	}

	if (testId === 'B') {
		// including the setup for test A
		// setup for test B
		...
	}
});
```

You might say it is very easy to find a smarter way. This is true for use-cases when your setup doesn't include things like [setting up a whole mock git history](https://github.com/conventional-changelog/conventional-changelog-core/blob/master/test/test.js).


## Install

```
$ npm install --save-dev better-than-before
```


## Usage

With this module, you could simplify your setup using beautiful declarative DSL syntax:

```js
// class
import BetterThanBefore from 'better-than-before';
import { setups,  preparing } = new BetterThanBefore();

// factory
import betterThanBefore from 'better-than-before';
import { setups,  preparing } = betterThanBefore();

setups([
	() => {
		// setup for all tests
		return 8; // optionally returns something
	},
	() => {
		// setup for all tests except for tests only need the first setup
		return 42; // optionally returns something
	},
	...
]);

test('A', () => {
	preparing(1); // I only need the first setup
	// returns [8]
});

test('B', () => {
	preparing(2); // I need both first and second setup
	// returns [8, 42]
});

...
```

### Not in order?

All you need to do is to provide a teardown function with `tearsWithJoy`. The teardown function needs to clean up all the setups and once `preparing()` is called, it will rebuild the setups that's needed.

```js
// class
import BetterThanBefore from 'better-than-before';
import { setups,  preparing, tearsWithJoy } = new BetterThanBefore();

setups([
	() => {
		// setup for all tests
	},
	() => {
		// setup for all tests except for tests only need the first setup
	},
	...
]);

tearsWithJoy(() => {
	// teardown the setups!
});

test('B', () => {
	preparing(2); // I need both first and second setup
});

test('A', () => {
	// teardown is run
	// then rerun the first setup
	preparing(1); // I only need the first setup
});

...
```


## Caveat

The most straightforward way of using this module is to put this in the test block. But test frameworks like mocha also time how long a test runs and you might easily hit timeout. I could hack into the framework but I decided not to. Make sure you increase your timeout and ignore the performance warnings. If you use this module in a performance framework make sure it's not run in the test block.


## License

MIT © [Steve Mao](https://github.com/stevemao)
