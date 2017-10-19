import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'

import { configureStore, Root } from 'pubsweet-client'

import { AppContainer } from 'react-hot-loader'
import createHistory from 'history/createBrowserHistory'

import routes from './routes'

const history = createHistory()
const store = configureStore(history, {})

const rootEl = document.getElementById('root')

ReactDOM.render(
  <AppContainer>
    <Root store={store} history={history} routes={routes} />
  </AppContainer>,
  rootEl
)

if (module.hot) {
  module.hot.accept('pubsweet-client/src/components/Root', () => {
    const NextRoot = require('pubsweet-client/src/components/Root').default

    ReactDOM.render(
      <AppContainer>
        <NextRoot store={store} history={history} routes={routes} />
      </AppContainer>,
      rootEl
    )
  })
}
