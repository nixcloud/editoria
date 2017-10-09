import React from 'react'
import { browserHistory } from 'react-router'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavbarBrand } from 'react-bootstrap'

import Authorize from 'pubsweet-client/src/helpers/Authorize'
import NavbarUser from 'pubsweet-component-navigation/NavbarUser'

// TODO -- break into smaller components
export default class Navigation extends React.Component {
  constructor (props) {
    super(props)
    this.logout = this.logout.bind(this)

    // rewrite cleaner
    // should the manage component maybe pass the location prop?
    browserHistory.listen(function (event) {
      this.collectionId = ''
      this.inEditor = event.pathname.match(/fragments/g)
      if (this.inEditor) {
        let pathnameSplited = event.pathname.split('/')
        this.collectionId = pathnameSplited[2]
      }
    }.bind(this))
  }

  logout () {
    const { logoutUser } = this.props.actions
    logoutUser()
    browserHistory.push('/login')
  }

  render () {
    const { currentUser } = this.props
    let logoutButtonIfAuthenticated

    if (currentUser.isAuthenticated) {
      logoutButtonIfAuthenticated = (
        <NavbarUser
          user={currentUser.user}
          onLogoutClick={this.logout}
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
            <a href='#'>
              Editoria
            </a>
          </NavbarBrand>
        </Navbar.Header>

        <Nav>
          <LinkContainer to='/books'>
            <NavItem>Books</NavItem>
          </LinkContainer>

          <Authorize operation='read' object='users'>
            <LinkContainer to='/users'>
              <NavItem>Users</NavItem>
            </LinkContainer>
          </Authorize>

          <Authorize operation='read' object='teams'>
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
  actions: React.PropTypes.object.isRequired,
  currentUser: React.PropTypes.object
}
