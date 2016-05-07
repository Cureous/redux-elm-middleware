import assert from 'assert'
import sinon from 'sinon'
import configureStore from 'redux-mock-store';
import createMiddleware from '../src'

describe('Middleware', () => {
  it('should be a function', () => {
    assert.equal(typeof createMiddleware, 'function')
  })

  it('should create a middleware', () => {
    const mockStore = configureStore([ createMiddleware({}).elmMiddleware ])({})

    mockStore.dispatch({ type: 'TEST' })


    assert.deepEqual(mockStore.getActions(), [{ type: 'TEST' }]);
  })

  it('should send a action to a port if present', () => {
    const spy = sinon.spy()
    const { elmMiddleware } = createMiddleware({
      ports: {
        TEST: {
          send: spy
        }
      }
    })
    const mockStore = configureStore([elmMiddleware])({})

    mockStore.dispatch({ type: 'TEST' })
    mockStore.dispatch({ type: 'NO_PORT' })
    mockStore.dispatch({ type: 'TEST', payload: 'foo' })


    assert.deepEqual(mockStore.getActions(), [
        { type: 'TEST' },
        { type: 'NO_PORT' },
        { type: 'TEST', payload: 'foo' }
    ]);
    assert.ok(spy.getCall(0).args[0] === null);
    assert.ok(spy.getCall(1).args[0] === 'foo');
  })
})
