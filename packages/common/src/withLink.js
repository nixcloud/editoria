import React from 'react'
import { Link } from 'react-router-dom'

const withLink = (children, whereTo) => (
  <Link to={whereTo}>{children}</Link>
)

export default withLink
