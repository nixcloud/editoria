import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const withLink = (children, whereTo) => <Link to={whereTo}>{children}</Link>

withLink.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.node),
  ]).isRequired,
  whereTo: PropTypes.string.isRequired,
}

export default withLink
