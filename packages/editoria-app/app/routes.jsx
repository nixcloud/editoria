import React from 'react'
import { Redirect, Route } from 'react-router'

import { requireAuthentication } from 'pubsweet-client/src/components/AuthenticatedComponent'

// Manage
import Manage from 'pubsweet-component-manage/Manage'
import UsersManager from 'pubsweet-component-users-manager/UsersManager'
import TeamsManager from 'pubsweet-component-teams-manager/TeamsManager'
import Blog from 'pubsweet-component-blog/Blog'

// Authentication
import Login from 'pubsweet-component-login/Login'
import Signup from 'pubsweet-component-signup/Signup'

// Editor
import Wax from 'pubsweet-component-wax/src/WaxPubsweet'
import WithConfig from 'pubsweet-component-wax/src/WithConfig'

// Editoria
// import BookBuilder from './components/BookBuilder/BookBuilder'
import BookBuilder from 'pubsweet-component-bookbuilder/src/BookBuilder'
import Dashboard from 'pubsweet-component-editoria-dashboard/src/Dashboard'

// Pass configuration to editor
const Editor = WithConfig(Wax, {
  layout: 'default',
  lockWhenEditing: true
})

// FIXME: this shouldn't be using the collection as the object

const AuthenticatedManage = requireAuthentication(
  Manage, 'create', state => state.collections
)

// TODO
// these two setups are a bit hacky, but they work
// leaving, as their components will most likely be removed completely soon
const AdminOnlyUsersManager = requireAuthentication(
  UsersManager, 'admin', state => state.collections[0]
)

const AdminOnlyTeamsManager = requireAuthentication(
  TeamsManager, 'admin', state => state.collections[0]
)

export default (
  <Route>
    <Redirect from='/' to='books' />
    <Redirect from='/manage/posts' to='books' />

    <Route path='/' component={AuthenticatedManage}>
      <Route path='books' component={Dashboard} />
      <Route path='blog' component={Blog} />
      <Route path='books/:id/book-builder' component={BookBuilder} />
      <Route path='books/:bookId/fragments/:fragmentId' component={Editor} />

      <Route path='users' component={AdminOnlyUsersManager} />
      <Route path='teams' component={AdminOnlyTeamsManager} />
    </Route>

    <Route path='/login' component={Login} />
    <Route path='/signup' component={Signup} />

    <Redirect path='*' to='books' />
  </Route>
)
