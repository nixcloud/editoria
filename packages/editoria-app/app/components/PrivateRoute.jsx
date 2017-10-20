import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { Route, Redirect, withRouter } from 'react-router-dom'
import { actions } from 'pubsweet-client'

class PrivateRoute extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      complete: false
    }
  }

  componentDidMount () {
    const onComplete = () => {
      this.setState({
        complete: true
      })
    }

    this.props.getCurrentUser().then(onComplete, onComplete)
  }

  render () {
    const { currentUser, getCurrentUser, component: Component, ...rest } = this.props

    return (
      <Route
        render={(props) => {
          // complete, authenticated
          if (currentUser.isAuthenticated) {
            return <Component {...props} />
          }

          // complete, not authenticated
          if (this.state.complete) {
            return (
              <Redirect
                to={{
                  pathname: '/login',
                  state: { from: props.location }
                }}
              />
            )
          }

          // incomplete, loading
          if (currentUser.isFetching) {
            return <div>loading…</div>
          }

          // incomplete, not yet loading
          return null
        }}
        {...rest}
      />
    )
  }
}

PrivateRoute.propTypes = {
  component: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    isAuthenticated: PropTypes.bool.isRequired,
    isFetching: PropTypes.bool.isRequired
  }).isRequired,
  getCurrentUser: PropTypes.func.isRequired,
  location: PropTypes.object.isRequired
}

export default withRouter(connect(
  state => ({
    currentUser: state.currentUser,
  }),
  {
    getCurrentUser: actions.getCurrentUser
  }
)(PrivateRoute))
