import test from 'ava';
import {spy} from 'sinon';
import BetterThanBefore from './';
import betterThanBefore from './index';

function run(t, setups, preparing) {
	const fn1 = spy();
	const fn2 = spy();

	setups([
		fn1,
		fn2
	]);

	preparing(1);
	t.true(fn1.calledOnce);
	t.true(fn2.notCalled);

	preparing(2);
	t.true(fn1.calledOnce);
	t.true(fn2.calledOnce);
	t.true(fn1.calledBefore(fn2));

	preparing(2);
	t.true(fn1.calledOnce);
	t.true(fn2.calledOnce);
}

test('class', t => {
	const {setups, preparing} = new BetterThanBefore();
	run(t, setups, preparing);

	const betterThanBefore = new BetterThanBefore();
	const fn1 = spy();
	const fn2 = spy();
	betterThanBefore.setups([
		fn1,
		fn2
	]);
	betterThanBefore.preparing(2);
	t.true(fn1.calledOnce);
	t.true(fn2.calledOnce);
	t.true(fn1.calledBefore(fn2));
});

test('factory', t => {
	const {setups, preparing} = betterThanBefore();
	run(t, setups, preparing);
});

test('not in order', t => {
	const {setups, preparing, tearsWithJoy} = betterThanBefore();

	const fn1 = spy();
	const fn2 = spy();
	const fn3 = spy();

	setups([
		fn1,
		fn2
	]);

	tearsWithJoy(fn3);

	preparing(2);
	t.true(fn1.calledOnce);
	t.true(fn2.calledOnce);
	t.true(fn3.notCalled);

	preparing(1);
	t.true(fn1.calledTwice);
	t.true(fn2.calledOnce);
	t.true(fn1.calledBefore(fn2));
	t.true(fn3.calledOnce);
});

test('not in order without tearsWithJoy', t => {
	const {setups, preparing} = betterThanBefore();

	const fn1 = spy();
	const fn2 = spy();

	setups([
		fn1,
		fn2
	]);

	preparing(2);

	t.throws(() => {
		preparing(1);
	});
});

test('return context', t => {
	const {setups, preparing} = betterThanBefore();

	setups([
		function (context) {
			context.number = 42;
		},
		function (context) {
			context.helloWorld = 'hello world';
		}
	]);

	t.deepEqual(preparing(1), {number: 42});
	t.deepEqual(preparing(2), {number: 42, helloWorld: 'hello world'});
});

test('overwrite context', t => {
	const {setups, preparing} = betterThanBefore();

	setups([
		function (context) {
			context.number = 8;
		},
		function (context) {
			context.number = 42;
			context.helloWorld = 'hello world';
		}
	]);

	t.deepEqual(preparing(1), {number: 8});
	t.deepEqual(preparing(2), {number: 42, helloWorld: 'hello world'});
});

test('setup can access context', t => {
	const {setups, preparing} = betterThanBefore();

	setups([
		function (context) {
			context.number = 42;
		},
		function (context) {
			t.deepEqual(context.number, 42);
		}
	]);

	preparing(2);
});

test('setup can access context but first setup actually didn\'t run', t => {
	const {setups, preparing} = betterThanBefore();

	setups([
		function (context) {
			context.number = 42;
		},
		function (context) {
			t.deepEqual(context.number, 42);
		}
	]);

	preparing(1);
	preparing(2);
});
