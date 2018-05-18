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
import Manage from 'pubsweet-component-manage/Manage'
import Navigation from './components/Navigation/Navigation'
import PrivateRoute from './components/PrivateRoute'
// import AuthenticatedManage from './components/AuthenticatedManage/AuthenticatedManage'

// Pass configuration to editor
const Editor = WithConfig(Wax, {
  layout: 'editoria',
  lockWhenEditing: true,
})

// export default (
//   <Manage nav={<Navigation />}>
//     <Switch>
//       <Redirect exact path='/' to='/books' />

//       <PrivateRoute exact path='/books' component={Dashboard} />
//       <PrivateRoute path='/books/:id/book-builder' component={BookBuilder} />
//       <PrivateRoute path='/books/:bookId/fragments/:fragmentId' component={Editor} />

//       <PrivateRoute path='/teams' component={TeamsManager} />
//       <PrivateRoute path='/users' component={UsersManager} />

//       <Route path='/login' component={Login} />
//       <Route path='/signup' component={Signup} />
//       <Route path='/password-reset' component={PasswordReset} />
//     </Switch>
//   </Manage>
// )

// export default (
//   <Switch>
//     <Redirect exact path="/" to="/books" />
//     <Route path="/login" component={Login} />
//     <Route path="/signup" component={Signup} />
//     <Route path="/password-reset" component={PasswordReset} />

//     <div>
//       <Navigation />

//       <PrivateRoute exact path="/books" component={Dashboard} />
//       <PrivateRoute path="/books/:id/book-builder" component={BookBuilder} />
//       <PrivateRoute
//         path="/books/:bookId/fragments/:fragmentId"
//         component={Editor}
//       />

//       <PrivateRoute path="/teams" component={TeamsManager} />
//       <PrivateRoute path="/users" component={UsersManager} />
//     </div>
//   </Switch>
// )

export default (
  <Switch>
    <Redirect exact path="/" to="/books" />
    <Route component={Login} path="/login" />
    <Route component={Signup} path="/signup" />
    <Route component={PasswordReset} path="/password-reset" />

    <Manage nav={<Navigation />}>
      <PrivateRoute component={Dashboard} exact path="/books" />
      <PrivateRoute component={BookBuilder} path="/books/:id/book-builder" />

      <PrivateRoute
        component={Editor}
        path="/books/:bookId/fragments/:fragmentId"
      />
      <PrivateRoute component={UsersManager} path="/users" />
    </Manage>
  </Switch>
)

// const Managed = () => (
//   <AuthenticatedManage>
//     <Switch>
//       <Route component={Dashboard} path="/manage/books" />
//       <Route component={UsersManager} path="/manage/users" />
//       <Route component={TeamsManager} path="/manage/teams" />
//       <Route component={BookBuilder} path="/manage/books/:id/book-builder" />
//     </Switch>
//   </AuthenticatedManage>
// )

// export default (
//   <Switch>
//     <Route component={Managed} path="/manage" />
//     <Route component={Login} path="/login" />
//     <Route component={Signup} path="/signup" />

//   </Switch>
// )
