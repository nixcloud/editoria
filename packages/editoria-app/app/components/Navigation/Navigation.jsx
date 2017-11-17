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
  // rewrite cleaner
  // should the manage component maybe pass the location prop?
  didMount () {
    this.props.history.listen((event) => {
      this.collectionId = ''
      this.inEditor = event.pathname.match(/fragments/g)
      if (this.inEditor) {
        const pathnameSplited = event.pathname.split('/')
        this.collectionId = pathnameSplited[2]
      }
    })
  }

  render () {
    const { logoutUser, currentUser } = this.props
    let logoutButtonIfAuthenticated

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
        <LinkContainer to={'/books/' + this.collectionId + '/book-builder'}>
          <NavItem>Back to book</NavItem>
        </LinkContainer>
       )
    }

    // TODO --  fix object properties underneath
    return (
      <Navbar fluid>
        <Navbar.Header>
          <NavbarBrand>
            <a href='/'>Editoria</a>
          </NavbarBrand>
        </Navbar.Header>

        <Nav>
          <LinkContainer to='/books'>
            <NavItem>Books</NavItem>
          </LinkContainer>

          <Authorize operation='read' object={{ path: '/users' }}>
            <LinkContainer to='/users'>
              <NavItem>Users</NavItem>
            </LinkContainer>
          </Authorize>

          <Authorize operation='read' object={{ path: '/teams' }}>
            <LinkContainer to='/teams'>
              <NavItem>Teams</NavItem>
            </LinkContainer>
          </Authorize>

          {BackToBooks}
        </Nav>

        { logoutButtonIfAuthenticated }
      </Navbar>
    )
  }
}

Navigation.propTypes = {
  currentUser: PropTypes.object,
  logoutUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
}

export default withRouter(connect(
  state => ({
    currentUser: state.currentUser
  }),
  {
    logoutUser: actions.logoutUser
  }
)(Navigation))
