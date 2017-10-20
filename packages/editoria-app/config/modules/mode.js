function isOwner (user, object) {
  if (!user) return false

  if (object && object.owners) {
    const owner = object.owners.find((o) => {
      return o.id === user.id
    })
    if (owner) return true
  }

  return false
}

function belongsToTeam (user, team) {
  const teams = user.teams.filter((t) => {
    return t.teamType.name === team
  })
  return teams.length > 0
}

function isAuthor (user) {
  return belongsToTeam(user, 'Author')
}

function isCopyEditor (user) {
  return belongsToTeam(user, 'Copy Editor')
}

function isProductionEditor (user) {
  return belongsToTeam(user, 'Production Editor')
}

function hasRightsOnCollection (user, collectionId) {
  const collectionInTeams = user.teams.find((team) => {
    const type = team.object.type
    const id = team.object.id
    return type === 'collection' && id === collectionId
  })

  if (collectionInTeams) return true
  return false
}

// function isWorkflowIng (fragment, workflow) {
//   if (fragment && fragment.progress) {
//     if (workflow) {
//       return fragment.progress[workflow] === 1
//     }
//   }
//   return false
// }

const editoria = (user, operation, object) => {
  if (!user) return false
  if (user.admin) return true

  if (operation === 'admin') return false

  // object might be an array of objects (eg. teams, users, etc.)
  // pick up if that is the case and use the first one to define the type of those objects
  if (Array.isArray(object)) {
    const list = object

    let type
    if (list.length > 0) type = list[0].type

    if (type === 'user' || type === 'team') {
      if (isProductionEditor(user)) {
        if (operation === 'read') return true
        if (operation === 'update' && type === 'team') return true
      }

      // remove when you can write to collection
      // only here to get the collection's production editor
      // edit: also here for the user to be able to read the teams
      // TODO eventually the user should only get his teams
      if ((isCopyEditor(user) || isAuthor(user)) && operation === 'read') return true

      return false
    }

    // TODO -- handle array of collections
    if (type === 'collection') {
      return true
    }

    // TO DO -- can anyone manage an array of fragments
  }

  if (object.type === 'fragment') {
    const fragment = object
    const collectionId = fragment.book

    if (operation === 'read') return true

    if (!hasRightsOnCollection(user, collectionId)) return false

    if (isProductionEditor(user)) return true
    // TO DO -- what about create and delete?

    if (operation === 'read' || operation === 'delete' || operation === 'create') return true

    // temporarily here -- change when you see what the update was
    if (operation === 'update') return true

    // do not block the if flow, as someone might belong to more than one team
    // if (operation === 'update') {
    //   if (isCopyEditor(user)) {
    //     const isEditing = isWorkflowIng(fragment, 'edit')
    //     if (isEditing) return true
    //   }

    //   if (isAuthor(user)) {
    //     const isReviewing = isWorkflowIng(fragment, 'review')
    //     if (isReviewing) return true
    //   }
    // }
  }

  if (object.type === 'collection') {
    const collection = object
    const hasRights = hasRightsOnCollection(user, collection.id)

    if (hasRights) {
      if (isProductionEditor(user)) return true

      if (isCopyEditor(user) || isAuthor(user)) {
        // remove the create, this WILL NOT work for multiple collections
        // simply here to bypass the fact that to create a fragment for the collection,
        // you need to have create rights for the collection itself
        if (operation === 'read' || operation === 'create') return true
      }
    }

    if (isOwner(user, collection)) return true
  }

  if (object.type === 'user') {
    return user.id === object.id
  }

  if (object.type === 'team') {
    const team = object
    const collectionId = team.object.id

    if (!hasRightsOnCollection(user, collectionId)) return false

    const permittedOperations = ['update', 'read']
    if (!permittedOperations.includes(operation)) return false

    if (isProductionEditor(user)) return true

    return false
  }

  // console.log('all failed \n')

  return false
}

module.exports = editoria
