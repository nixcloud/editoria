const _ = require('lodash')

// TODO: who can do what to collections?
const routePermissions = {
  '/collections': {
    GET: () => false,
    POST: () => false
  },
  '/collections/:id/fragments': {
    GET: () => false,
    POST: () => false
  },
  '/fragments': {
    GET: () => false,
    POST: () => false
  },
  '/teams': {
    GET: () => false,
    POST: () => false
  },
  '/users': {
    GET: () => false,
    POST: () => false
  }
}

const routePermission = (user, operation, route) => {
  const permission = _.get(routePermissions, [route.path, operation])

  return permission && permission({ route, user })
}

const isOwner = (user, object) => {
  if (!user || !object || !object.owners) return false

  // return object.owners.includes(user.id)
  return object.owners.some(owner => owner.id === user.id)
}

const hasTeamPermission = (user, operation, object) =>
  user.teams.some(team =>
    team.object.type === object.type &&
    team.object.id === object.id &&
    team.permissions.includes(operation)
)

module.exports = async (userId, operation, object, context) => {
  // no anonymous access
  if (!userId) return false

  // load the User
  const user = await context.models.User.find(userId)

  // admins can do anything
  if (user.admin) return true

  // only admins can do the "admin" operation
  if (operation === 'admin') return false

  // check permissions for a route
  if (!object.type) return routePermission(user, operation, object)

  switch (object.type) {
    case 'user':
      return object.id === user.id

    case 'team':
      return false // TODO: who can read/write a team?

    case 'collection':
    case 'fragment':
      // the owner can do anything
      if (isOwner(user, object)) return true

      // load the user's teams
      user.teams = await Promise.all(user.teams.map(id => context.models.Team.find(id)))

      // check permissions for a collection's teams
      if (object.type === 'collection') {
        return hasTeamPermission(user, operation, object)
      }

      // check permissions for a fragment's teams and the parent collection's teams
      return hasTeamPermission(user, operation, object) ||
       hasTeamPermission(user, operation, { id: object.book, type: 'collection' })

    default:
      throw new Error('Unknown object type')
  }
}
