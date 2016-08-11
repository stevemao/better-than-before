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
$ npm install --save better-than-before
```


## Usage

```js
const betterThanBefore = require('better-than-before');

betterThanBefore('unicorns');
//=> 'unicorns & rainbows'
```


## API

### betterThanBefore(input, [options])

#### input

Type: `string`

Lorem ipsum.

#### options

##### foo

Type: `boolean`<br>
Default: `false`

Lorem ipsum.


## Caveat

The most straightforward way of using this module is to put this in the test block. But test frameworks like mocha also time how long a test runs and you might easily hit timeout. I could hack into the framework but I decided not to. Make sure you increase your timeout and ignore the performance warnings. If you use this module in a performance framework make sure it's not run in the test block.


## License

MIT © [Steve Mao](https://github.com/stevemao)
