import React from 'react'
import PropTypes from 'prop-types'
import { withRouter, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

import Authorize from 'pubsweet-client/src/helpers/Authorize'
import actions from 'pubsweet-client/src/actions'
import { AppBar } from '@pubsweet/ui'

import classes from './Navigation.local.scss'

// TODO -- break into smaller components
class Navigation extends React.Component {
  constructor(props) {
    super(props)
    this.collectionId = ''
    this.inEditor = null
  }

  componentDidMount() {
    this.shouldAddBookLink()
  }

  componentWillUpdate() {
    this.shouldAddBookLink()
  }

  shouldAddBookLink() {
    const { history } = this.props
    const { location } = history
    const { pathname } = location

    this.collectionId = ''
    this.inEditor = null

    this.inEditor = pathname.match(/fragments/g)
    if (this.inEditor) {
      const pathnameSplit = pathname.split('/')
      this.collectionId = pathnameSplit[2]
    }
  }

  render() {
    const { logoutUser, currentUser } = this.props

    // TODO --  fix object properties underneath
    return (
      <AppBar
        brand="Editoria"
        className={classes.root}
        navLinks={
          <NavLinks collectionId={this.collectionId} inEditor={this.inEditor} />
        }
        onLogoutClick={logoutUser}
        user={currentUser.user}
      />
    )
  }
}

const NavLinks = ({ inEditor, collectionId }) => (
  <div>
    <NavLink to="/books">Books</NavLink>

    <Authorize operation="read" object={{ path: '/users' }}>
      <NavLink to="/users">Users</NavLink>
    </Authorize>

    <Authorize operation="read" object={{ path: '/teams' }}>
      <NavLink to="/teams">Teams</NavLink>
    </Authorize>

    {inEditor && (
      <NavLink to={`/books/${collectionId}/book-builder`}>Back to book</NavLink>
    )}
  </div>
)

Navigation.propTypes = {
  currentUser: PropTypes.object,
  history: PropTypes.object.isRequired,
  logoutUser: PropTypes.func.isRequired,
}

export default withRouter(
  connect(
    state => ({
      currentUser: state.currentUser,
    }),
    {
      logoutUser: actions.logoutUser,
    },
  )(Navigation),
)
