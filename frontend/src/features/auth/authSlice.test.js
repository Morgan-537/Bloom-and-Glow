import authReducer, { login, register, loginSuccess, logout } from './authSlice'

// These tests exercise the synchronous reducer logic only — they dispatch the
// plain action objects that `login`/`register` (createAsyncThunk) produce at
// each stage, rather than calling the thunks themselves. That way the tests
// don't need a running json-server / network access to verify state.status,
// state.user, and state.error update correctly.

describe('authSlice', () => {
  const initialState = { user: null, token: null, status: 'idle', error: null }

  it('loginSuccess logs the user in directly', () => {
    const next = authReducer(
      initialState,
      loginSuccess({
        user: { id: '1', fullName: 'Jane Doe', email: 'jane@example.com', role: 'customer' },
        token: 'fake-token',
      })
    )
    expect(next.user.fullName).toBe('Jane Doe')
    expect(next.token).toBe('fake-token')
    expect(next.status).toBe('succeeded')
  })

  it('logout clears the session', () => {
    const loggedIn = { user: { id: '1', fullName: 'Jane Doe' }, token: 't', status: 'succeeded', error: null }
    const next = authReducer(loggedIn, logout())
    expect(next.user).toBeNull()
    expect(next.token).toBeNull()
    expect(next.status).toBe('idle')
  })

  it('login.pending sets status to loading and clears any previous error', () => {
    const withError = { ...initialState, error: 'previous error' }
    const next = authReducer(withError, { type: login.pending.type })
    expect(next.status).toBe('loading')
    expect(next.error).toBeNull()
  })

  it('login.fulfilled stores the normalized user and token', () => {
    const next = authReducer(initialState, {
      type: login.fulfilled.type,
      payload: {
        user: { id: '2', fullName: 'Jane Doe', email: 'jane@example.com', role: 'customer' },
        token: 'abc',
      },
    })
    expect(next.status).toBe('succeeded')
    expect(next.user.email).toBe('jane@example.com')
    expect(next.token).toBe('abc')
  })

  it('login.rejected stores the error message and leaves the user logged out', () => {
    const next = authReducer(initialState, {
      type: login.rejected.type,
      payload: 'Could not reach the server. Make sure `npm run server` is running on port 4000.',
    })
    expect(next.status).toBe('failed')
    expect(next.error).toMatch(/npm run server/)
    expect(next.user).toBeNull()
  })

  it('register.fulfilled logs the new account in the same way login does', () => {
    const next = authReducer(initialState, {
      type: register.fulfilled.type,
      payload: {
        user: { id: '3', fullName: 'New Customer', email: 'new@example.com', role: 'customer' },
        token: 'xyz',
      },
    })
    expect(next.status).toBe('succeeded')
    expect(next.user.fullName).toBe('New Customer')
  })

  it('register.rejected stores the error message', () => {
    const next = authReducer(initialState, {
      type: register.rejected.type,
      payload: 'An account with this email already exists.',
    })
    expect(next.status).toBe('failed')
    expect(next.error).toBe('An account with this email already exists.')
  })
})
