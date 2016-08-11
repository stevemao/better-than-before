import test from 'ava';
import {spy} from 'sinon';
import {setups, preparing} from './';

test(t => {
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

	preparing(2);
	t.true(fn1.calledOnce);
	t.true(fn2.calledOnce);
});
