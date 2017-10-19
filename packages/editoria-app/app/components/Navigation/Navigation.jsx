import React from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import { Navbar, Nav, NavItem, NavbarBrand } from 'react-bootstrap'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import Authorize from 'pubsweet-client/src/helpers/Authorize'
import NavbarUser from 'pubsweet-component-navigation/NavbarUser'
import actions from 'pubsweet-client/src/actions'

// TODO -- break into smaller components
class Navigation extends React.Component {
  // rewrite cleaner
  // should the manage component maybe pass the location prop?
  didMount () {
    browserHistory.listen((event) => {
      this.collectionId = ''
      this.inEditor = event.pathname.match(/fragments/g)
      if (this.inEditor) {
        const pathnameSplited = event.pathname.split('/')
        this.collectionId = pathnameSplited[2]
      }
    })
  }

  // logout () {
  //   const { logoutUser } = this.props.actions
  //   logoutUser()
  //   browserHistory.push('/login')
  // }

  render () {
    const { actions, currentUser } = this.props
    let logoutButtonIfAuthenticated

    if (currentUser.isAuthenticated) {
      console.log(currentUser)
      logoutButtonIfAuthenticated = (
        <NavbarUser
          user={currentUser.user}
          onLogoutClick={this.logoutUser}
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
  actions: PropTypes.object.isRequired,
  currentUser: PropTypes.object
}

function mapState (state) {
  return {
    currentUser: state.currentUser
  }
}

function mapDispatch (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default connect(mapState, mapDispatch)(Navigation)
