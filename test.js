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
