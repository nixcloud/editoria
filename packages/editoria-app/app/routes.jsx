import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
// // import { Redirect, Route } from 'react-router-dom'

// import { requireAuthentication } from 'pubsweet-client/src/components/AuthenticatedComponent'

// import AuthenticatedComponent from 'pubsweet-client/src/components/AuthenticatedComponent'

// // Manage
// import Manage from 'pubsweet-component-manage/Manage'
// // import UsersManager from 'pubsweet-component-users-manager/UsersManager'
// // import TeamsManager from 'pubsweet-component-teams-manager/TeamsManager'
// // import Blog from 'pubsweet-component-blog/Blog'

// // Authentication
import Login from 'pubsweet-component-login/Login'
import Signup from 'pubsweet-component-signup/Signup'

// // Editor
// // import Wax from 'pubsweet-component-wax/src/WaxPubsweet'
// // import WithConfig from 'pubsweet-component-wax/src/WithConfig'

// // Editoria
// // import BookBuilder from './components/BookBuilder/BookBuilder'
// import BookBuilder from 'pubsweet-component-bookbuilder/src/BookBuilder'
import Dashboard from 'pubsweet-component-editoria-dashboard/src/Dashboard'

import AuthenticatedManage from './components/AuthenticatedManage/AuthenticatedManage'

// // Nav
// import Navigation from './components/Navigation/Navigation'

// const AuthenticatedManage = ({ children, ...props }) => {
//   console.log(props)
//   return <Manage nav={<Navigation />}>
//     <AuthenticatedComponent
//       operation='GET'
//       selector={state => state.collections[0]}
//       unauthorized={<p>You are not authorized to view this page.</p>}
//       {...props}
//     >
//       {children}
//     </AuthenticatedComponent>
//   </Manage>
// }

// // Pass configuration to editor
// // const Editor = WithConfig(Wax, {
// //   layout: 'editoria',
// //   lockWhenEditing: true
// // })

// // FIXME: this shouldn't be using the collection as the object

// // const AuthenticatedManage = requireAuthentication(
// //   Manage, 'create', state => state.collections
// // )

// // TODO
// // these two setups are a bit hacky, but they work
// // leaving, as their components will most likely be removed completely soon
// // const AdminOnlyUsersManager = requireAuthentication(
// //   UsersManager, 'admin', state => state.collections[0]
// // )

// // const AdminOnlyTeamsManager = requireAuthentication(
// //   TeamsManager, 'admin', state => state.collections[0]
// // )

// const Authenticated = () => (
//   <AuthenticatedManage>
//     <Switch>
//       {<Route path='books' component={Dashboard} />}
//       {/* <Route path='books/:id/book-builder' component={BookBuilder} /> */}
//       {/* <Route path='books/:bookId/fragments/:fragmentId' component={Editor} /> */}
//     </Switch>
//   </AuthenticatedManage>
// )

class Managed extends React.Component {
  render () {
    return (
      <AuthenticatedManage>
        <Switch>
          <Route path='/books' component={Dashboard} />
        </Switch>
      </AuthenticatedManage>
    )
  }
}

// export default (
//   <Switch>
//     {/* <Redirect from='/' to='books' />
//     <Redirect from='/manage/posts' to='books' /> */}

//     {/* <Route path='/' component={AuthenticatedManage}> */}

//     {/* <Route path='/' component={Authenticated} /> */}

//       {/* <Route path='users' component={AdminOnlyUsersManager} />
//       <Route path='teams' component={AdminOnlyTeamsManager} /> */}
//     {/* </Route> */}

//     <Route path='/login' component={Login} />
//     <Route path='/signup' component={Signup} />

//     {/* <Redirect path='*' to='books' /> */}
//   </Switch>
// )

export default (
  <Switch>
    {/* <Redirect exact path='/' to='books' /> */}

    <Route path='/' component={Managed} />
    <Route path='/login' component={Login} />
    <Route path='/signup' component={Signup} />
  </Switch>
)
