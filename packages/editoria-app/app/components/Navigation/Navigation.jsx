import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavbarBrand } from 'react-bootstrap'
import { connect } from 'react-redux'

import Authorize from 'pubsweet-client/src/helpers/Authorize'
import NavbarUser from 'pubsweet-component-navigation/NavbarUser'
import actions from 'pubsweet-client/src/actions'

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
      const pathnameSplited = pathname.split('/')
      this.collectionId = pathnameSplited[2]
    }
  }

  render() {
    const { logoutUser, currentUser } = this.props
    let logoutButtonIfAuthenticated

    if (currentUser.user === null) return null

    if (currentUser.isAuthenticated) {
      logoutButtonIfAuthenticated = (
        <NavbarUser
          user={currentUser.user}
          onLogoutClick={() => logoutUser('/login')}
        />
      )
    }

    let BackToBooks
    if (this.inEditor) {
      BackToBooks = (
        <LinkContainer to={`/books/${this.collectionId}/book-builder`}>
          <NavItem>Back to book</NavItem>
        </LinkContainer>
      )
    }

    // TODO --  fix object properties underneath
    return (
      <Navbar fluid>
        <Navbar.Header>
          <NavbarBrand>
            <a href="/">Editoria</a>
          </NavbarBrand>
        </Navbar.Header>

        <Nav>
          <LinkContainer to="/books">
            <NavItem>Books</NavItem>
          </LinkContainer>

          <Authorize operation="PRESENTATION" object={{ path: '/users' }}>
            <LinkContainer to="/users">
              <NavItem>Users</NavItem>
            </LinkContainer>
          </Authorize>

          <Authorize operation="PRESENTATION" object={{ path: '/teams' }}>
            <LinkContainer to="/teams">
              <NavItem>Teams</NavItem>
            </LinkContainer>
          </Authorize>

          {BackToBooks}
        </Nav>

        {logoutButtonIfAuthenticated}
      </Navbar>
    )
  }
}

Navigation.propTypes = {
  currentUser: PropTypes.any,
  history: PropTypes.any.isRequired,
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
