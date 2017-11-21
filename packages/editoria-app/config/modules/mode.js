/*
  PERMISSIONS DESCRIPTION

  Roles in Editoria:
  * Admin
  * Production Editor
  * Copy Editor
  * Author

  Admin:
    - Admins can perform all actions in the system

  Production Editor:
    - Production editors can perform all actions on a book (collection) and its
      associated chapters (fragments), as long as they are the editor for that
      book.
    - This means that they cannot see (read) other books, and by extension
      cannot delete or edit them.
    - They can assign copy editor and author roles to other users for the books
      they have rights on. But they cannot a book's production editor.

  Copy Editor:
    -

  Author:
    -
*/

/* eslint-disable no-console */

const _ = require('lodash')

// // TODO: who can do what to collections?
// const routePermissions = {
//   '/collections': {
//     GET: () => false,
//     POST: () => false
//   },
//   '/collections/:id/fragments': {
//     GET: () => false,
//     POST: () => false
//   },
//   '/fragments': {
//     GET: () => false,
//     POST: () => false
//   },
//   '/teams': {
//     GET: () => false,
//     POST: () => false
//   },
//   '/users': {
//     GET: () => false,
//     POST: () => false
//   }
// }

// const routePermission = (user, operation, route) => {
//   const permission = _.get(routePermissions, [route.path, operation])

//   return permission && permission({ route, user })
// }

// const isOwner = (user, object) => {
//   if (!user || !object || !object.owners) return false

//   // return object.owners.includes(user.id)
//   return object.owners.some(owner => owner.id === user.id)
// }

// const hasTeamPermission = (user, operation, object) =>
//   user.teams.some(team =>
//     team.object.type === object.type &&
//     team.object.id === object.id &&
//     team.permissions.includes(operation)
// )

// module.exports = async (userId, operation, object, context) => {
//   // no anonymous access
//   if (!userId) return false

//   // load the User
//   const user = await context.models.User.find(userId)

//   // admins can do anything
//   if (user.admin) return true

//   // only admins can do the "admin" operation
//   if (operation === 'admin') return false

//   // check permissions for a route
//   if (!object.type) return routePermission(user, operation, object)

//   switch (object.type) {
//     case 'user':
//       return object.id === user.id

//     case 'team':
//       return false // TODO: who can read/write a team?

//     case 'collection':
//     case 'fragment':
//       // the owner can do anything
//       if (isOwner(user, object)) return true

//       // load the user's teams
//       user.teams = await Promise.all(user.teams.map(id => context.models.Team.find(id)))

//       // check permissions for a collection's teams
//       if (object.type === 'collection') {
//         return hasTeamPermission(user, operation, object)
//       }

//       // check permissions for a fragment's teams and the parent collection's teams
//       return hasTeamPermission(user, operation, object) ||
//        hasTeamPermission(user, operation, { id: object.book, type: 'collection' })

//     default:
//       throw new Error('Unknown object type')
//   }
// }

const getTeamById = async (teamId, context) => {
  return context.models.Team.find(teamId)
}

const getUserTeams = async (user, context) => {
  const teams = user.teams.map(teamId => getTeamById(teamId, context))
  return Promise.all(teams)
}

const hasRightsOnObject = async (object, user, context) => {
  console.log('hello')
  const teams = await getUserTeams(user, context)
  const a = !_.isEmpty(teams.find(team => team.object.id === object.id))
  console.log(a)
  return a
}

const getRightsOnArray = async (arr, user, context) => {
  const values = arr.map(object => hasRightsOnObject(object, user, context))
  return Promise.all(values)
}

const getFilteredArray = async (arr, user, context) => {
  const valuesOnObjects = await getRightsOnArray(arr, user, context)
  console.log(valuesOnObjects)
  return arr.filter((collection, i) => valuesOnObjects[i])
}

const isProductionEditor = async (user, context) => {
  const teams = await getUserTeams(user, context)
  return !_.isEmpty(teams.find(team => team.teamType.name === 'Production Editor'))
}

const isProductionEditorForBook = async (book, user, context) => {
  const teams = await getUserTeams(user, context)
  return !_.isEmpty(
    teams.find(
      team =>
        team.teamType.name === 'Production Editor' &&
        team.object.id === book.id,
    ),
  )
}

const editoriaMode = async (userId, operation, object, context) => {
  // console.log('\n authsome')
  // console.log('userId', userId)
  // console.log('operation', operation)
  // console.log('object', object)
  // console.log('path', object.path)
  // console.log('context', context)

  if (!userId) return false // there is no public data
  const user = await context.models.User.find(userId)

  if (user && user.admin === true) return true // let admin do anything
  // HACK -- only admins can do the "admin" operation
  if (operation === 'admin') return false

  if (!object) return false

  if (!object.type && object.path) {
    switch (object.path) {
      case '/collections':
        if (operation === 'GET') {
          return {
            filter: collections => getFilteredArray(collections, user, context),
          }
        }

        if (operation === 'POST') {
          return isProductionEditor(user, context)
        }

        return false

      case '/teams':
        return true

      case '/users':
        return true

      default:
        return false
    }
  }

  switch (object.type) {
    case 'user':
      return true

    case 'team':
      return true

    case 'collection':
      console.log('collection', operation, object)
      if (operation === 'read' || operation === 'GET') {
        return hasRightsOnObject(object, user, context)
      }

      // if (operation === 'read' || operation === 'GET') {
      //   return hasRightsOnObject(object, user, context)
      // }

      if (operation === 'delete' || operation === 'DELETE') {
        return isProductionEditorForBook(object, user, context)
      }

      return false

    case 'fragment':
      return true

    default:
      return false
  }
}

module.exports = editoriaMode
