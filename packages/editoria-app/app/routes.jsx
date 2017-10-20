import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'

// Import Bootstrap + Font Awesome styles
import 'pubsweet-component-manage/Manage.scss'

// Users and Teams
import UsersManager from 'pubsweet-component-users-manager/UsersManagerContainer'
import TeamsManager from 'pubsweet-component-teams-manager/TeamsManagerContainer'

// Authentication
import Login from 'pubsweet-component-login/LoginContainer'
import Signup from 'pubsweet-component-signup/SignupContainer'
import PasswordReset from 'pubsweet-component-password-reset-frontend/PasswordReset'

// Editor
import Wax from 'pubsweet-component-wax/src/WaxPubsweet'
import WithConfig from 'pubsweet-component-wax/src/WithConfig'

// Editoria
import BookBuilder from 'pubsweet-component-bookbuilder/src/BookBuilder'
import Dashboard from 'pubsweet-component-editoria-dashboard/src/Dashboard'

import AuthenticatedManage from './components/AuthenticatedManage/AuthenticatedManage'

// Pass configuration to editor
const Editor = WithConfig(Wax, {
  layout: 'editoria',
  lockWhenEditing: true
})

const Manage = () => (
  <AuthenticatedManage>
    <Switch>
      <Route exact path='/manage/books' component={Dashboard} />
      <Route path='/manage/books/:id/book-builder' component={BookBuilder} />
      <Route path='/manage/books/:bookId/fragments/:fragmentId' component={Editor} />
      <Route path='/manage/teams' component={TeamsManager} />
      <Route path='/manage/users' component={UsersManager} />
    </Switch>
  </AuthenticatedManage>
)

export default (
  <Switch>
    <Redirect exact path='/' to='/manage/books' />

    <Route path='/manage' component={Manage} />
    <Route exact path='/login' component={Login} />
    <Route exact path='/signup' component={Signup} />
    <Route exact path='/password-reset' component={PasswordReset} />
  </Switch>
)
