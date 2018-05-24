const { collections, users, teams } = require('../fixtures/fixtures')

const userCollections = userId => {
  const user = findUser(userId)

  const allowedCollections = user.teams.map(teamId => {
    const teamFound = findTeam(teamId)
    return findCollection(teamFound.object.id)
  })

  return allowedCollections.filter(element => element !== null)
}

const userCollectionsPerRole = (teamType, userId) => {
  const user = findUser(userId)

  const allowedCollections = user.teams.map(teamId => {
    const teamFound = findTeam(teamId)
    if (teamFound.teamType === teamType) {
      return findCollection(teamFound.object.id)
    }
    return null
  })

  return allowedCollections.filter(element => element !== null)
}

const findUser = userId => {
  for (let i = 0; i <= users.length; i += 1) {
    if (users[i].id === userId) {
      return users[i]
    }
  }
  return {}
}

const findTeam = teamId => {
  for (let i = 0; i <= teams.length; i += 1) {
    if (teams[i].id === teamId) {
      return teams[i]
    }
  }
  return {}
}

const findCollection = collectionId => {
  for (let i = 0; i <= collections.length; i += 1) {
    if (collections[i].id === collectionId) {
      return collections[i]
    }
  }
  return {}
}

const findTeamsPerUser = userId => {
  const user = findUser(userId)
  const teams = user.teams.map(teamId => findTeam(teamId))

  return teams
}

module.exports = {
  userCollections,
  userCollectionsPerRole,
  findUser,
  findTeam,
  findCollection,
  findTeamsPerUser,
}
