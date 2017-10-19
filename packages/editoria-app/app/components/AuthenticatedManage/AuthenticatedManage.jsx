import React from 'react'
import PropTypes from 'prop-types'

import AuthenticatedComponent from 'pubsweet-client/src/components/AuthenticatedComponent'
import Manage from 'pubsweet-component-manage/Manage'
import Navigation from '../Navigation/Navigation'

const AuthenticatedManage = ({ children, ...props }) => (
  <Manage nav={<Navigation />}>
    <AuthenticatedComponent
      operation='GET'
      selector={state => state.collections[0]}
      unauthorized={<p>You are not authorized to view this page.</p>}
      {...props}
    >
      {children}
    </AuthenticatedComponent>
  </Manage>
)

AuthenticatedManage.propTypes = {
  children: PropTypes.node
}

export default AuthenticatedManage
