import 'regenerator-runtime/runtime'

import React from 'react'
import ReactDOM from 'react-dom'

import { configureStore, Root } from 'pubsweet-client'

import { AppContainer } from 'react-hot-loader'
import createHistory from 'history/createBrowserHistory'
import routes from './routes'

const history = createHistory()
const store = configureStore(history, {})

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Root store={store} history={history} routes={routes} />
    </AppContainer>,
    document.getElementById('root')
  )
}

render()

if (module.hot) {
  module.hot.accept('./routes', () => {
    render()
  })
}
