const Authsome = require('authsome')

const authsomeConfig = require('./teams-config')

const collections = [
  {
    id: 'collection1',
    type: 'collection',
  },
  {
    id: 'collection2',
    type: 'collection',
  },
  {
    id: 'collection3',
    type: 'collection',
  },
]

const teams = [
  {
    id: 'teamCollection1Prod',
    teamType: 'productionEditor',
    object: {
      id: 'collection1',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection1Cp',
    teamType: 'copyEditor',
    object: {
      id: 'collection1',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection1Auth',
    teamType: 'author',
    object: {
      id: 'collection1',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection2Prod',
    teamType: 'productionEditor',
    object: {
      id: 'collection2',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection2Cp',
    teamType: 'copyEditor',
    object: {
      id: 'collection2',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection2Auth',
    teamType: 'author',
    object: {
      id: 'collection2',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection3Prod',
    teamType: 'productionEditor',
    object: {
      id: 'collection3',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection3Cp',
    teamType: 'copyEditor',
    object: {
      id: 'collection3',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection3Auth',
    teamType: 'author',
    object: {
      id: 'collection3',
      type: 'collection',
    },
    type: 'team',
  },
]

const users = [
  {
    id: 'user',
    username: 'generic',
    teams: [],
    type: 'user',
  },
  {
    id: 'user1',
    username: 'alex',
    teams: ['teamCollection1Prod', 'teamCollection3Prod'],
    type: 'user',
  },
  {
    id: 'user2',
    username: 'chris',
    teams: ['teamCollection1Cp', 'teamCollection2Cp', 'teamCollection3Cp'],
    type: 'user',
  },
  {
    id: 'user3',
    username: 'john',
    teams: [
      'teamCollection1Auth',
      'teamCollection2Auth',
      'teamCollection3Auth',
    ],
    type: 'user',
  },
  {
    id: 'adminId',
    username: 'admin',
    admin: true,
    type: 'user',
  },
]

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

const authsome = new Authsome(
  { mode: require('../src/index'), ...authsomeConfig },
  {
    models: {
      User: { find: id => users.find(user => user.id === id) },
      Team: { find: id => teams.find(team => team.id === id) },
      Collection: {
        find: id => collections.find(collection => collection.id === id),
      },
    },
  },
)

describe('Admin', () => {
  it('allows everything to an admin', async () => {
    const permission = await authsome.can(
      'adminId',
      'DELETE',
      'thisSensitiveThing',
    )
    expect(permission).toBe(true)
  })
  it('lists all the existing collections', async () => {
    const permission = await authsome.can('adminId', 'GET', {
      path: '/collections',
    })
    expect(permission).toBe(true)
  })
  it('UI: sees the navigation links for Users', async () => {
    const permission = await authsome.can(
      'adminId',
      'can view nav links',
      'users',
    )
    expect(permission).toBe(true)
  })
  it('UI: sees the navigation links for Teams', async () => {
    const permission = await authsome.can(
      'adminId',
      'can view nav links',
      'teams',
    )
    expect(permission).toBe(true)
  })
  it('UI: sees the add button in dashboard', async () => {
    const permission = await authsome.can('adminId', 'can add books')
    expect(permission).toBe(true)
  })
  it('UI: sees the rename button in dashboard', async () => {
    const permission = await authsome.can(
      'adminId',
      'can rename books',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('UI: sees the delete button in dashboard', async () => {
    const permission = await authsome.can(
      'adminId',
      'can delete books',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('gets the available teams of the system', async () => {
    const permission = await authsome.can('adminId', 'GET', {
      path: '/teams',
    })
    expect(permission).toBe(true)
  })
  it('gets the available users of the system', async () => {
    const permission = await authsome.can('adminId', 'GET', {
      path: '/users',
    })
    expect(permission).toBe(true)
  })
  it('reads a collection', async () => {
    const permission = await authsome.can('adminId', 'GET', collections[0])
    expect(permission).toBe(true)
  })
  it('reads a team', async () => {
    const permission = await authsome.can('adminId', 'GET', teams[0])
    expect(permission).toBe(true)
  })
  it('reads a user', async () => {
    const permission = await authsome.can('adminId', 'GET', users[0])
    expect(permission).toBe(true)
  })
})

describe('User', () => {
  it('lists all the collections where she/he is assigned to', async () => {
    const permission = await authsome.can('user', 'GET', {
      path: '/collections',
    })
    const filteredCollections = await permission.filter(collections)
    expect(filteredCollections).toEqual(userCollections('user'))
  })
  it('could not get the available teams of the system if she/he is not a member', async () => {
    const permission = await authsome.can('user', 'GET', {
      path: '/teams',
    })
    const filteredTeams = await permission.filter(teams)
    expect(filteredTeams).toEqual([])
  })
  it('could not get the available users of the system', async () => {
    const permission = await authsome.can('user', 'GET', {
      path: '/users',
    })
    expect(permission).toBe(false)
  })
  it('could not read a collection she/he is not assigned to', async () => {
    const permission = await authsome.can('user', 'GET', collections[0])
    expect(permission).toBe(false)
  })
  it('could not read a team she/he is not member to', async () => {
    const permission = await authsome.can('user', 'GET', teams[0])
    expect(permission).toBe(false)
  })
  it('could not read other users', async () => {
    const permission = await authsome.can('user', 'GET', users[1])
    const filteredUsers = await permission.filter(users)
    expect(filteredUsers).toEqual({})
  })
})

describe('Production Editor', () => {
  it('lists only collections where user is a member of the production editors team', async () => {
    const permission = await authsome.can('user1', 'GET', {
      path: '/collections',
    })
    const filteredCollections = await permission.filter(collections)
    expect(filteredCollections).toEqual(
      userCollectionsPerRole('productionEditor', 'user1'),
    )
  })
  it('UI: sees the navigation links for Users', async () => {
    const permission = await authsome.can(
      'user1',
      'can view nav links',
      'users',
    )
    expect(permission).toBe(false)
  })
  it('UI: sees the navigation links for Teams', async () => {
    const permission = await authsome.can(
      'user1',
      'can view nav links',
      'teams',
    )
    expect(permission).toBe(false)
  })
  it('UI: sees the add button in dashboard', async () => {
    const permission = await authsome.can('user1', 'can add books')
    expect(permission).toBe(true)
  })
  it('UI: sees the rename button in dashboard', async () => {
    const permission = await authsome.can(
      'user1',
      'can rename books',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('UI: sees the delete button in dashboard', async () => {
    const permission = await authsome.can(
      'user1',
      'can delete books',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('gets the available teams of the system', async () => {
    const permission = await authsome.can('user1', 'GET', {
      path: '/teams',
    })
    const filteredTeams = await permission.filter(teams)
    expect(filteredTeams).toEqual(findTeamsPerUser('user1'))
  })
  it('gets the available users of the system', async () => {
    const permission = await authsome.can('user1', 'GET', {
      path: '/users',
    })
    expect(permission).toBe(true)
  })
  it('reads a collection where she/he is assigned as Production Editor', async () => {
    const permission = await authsome.can('user1', 'GET', collections[0])
    expect(permission).toBe(true)
  })
  it('reads a team she/he belongs', async () => {
    const permission = await authsome.can('user1', 'GET', teams[0])
    expect(permission).toBe(true)
  })
  it('reads her/him self', async () => {
    const permission = await authsome.can('user1', 'GET', users[1])
    expect(permission).toBe(true)
  })
})

describe('Copy Editor', () => {
  it('lists only collections where user is a member of the copy editors team', async () => {
    const permission = await authsome.can('user2', 'GET', {
      path: '/collections',
    })
    const filteredCollections = await permission.filter(collections)
    expect(filteredCollections).toEqual(
      userCollectionsPerRole('copyEditor', 'user2'),
    )
  })
  it('UI: sees the navigation links for Users', async () => {
    const permission = await authsome.can(
      'user2',
      'can view nav links',
      'users',
    )
    expect(permission).toBe(false)
  })
  it('UI: sees the navigation links for Teams', async () => {
    const permission = await authsome.can(
      'user2',
      'can view nav links',
      'teams',
    )
    expect(permission).toBe(false)
  })
  it('UI: sees the add button in dashboard', async () => {
    const permission = await authsome.can('user2', 'can add books')
    expect(permission).toBe(false)
  })
  it('UI: sees the rename button in dashboard', async () => {
    const permission = await authsome.can(
      'user2',
      'can rename books',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('UI: sees the delete button in dashboard', async () => {
    const permission = await authsome.can(
      'user2',
      'can delete books',
      collections[0],
    )
    expect(permission).toBe(false)
  })
})

describe('Author', () => {
  it('lists only collections where user is a member of the authors team', async () => {
    const permission = await authsome.can('user3', 'GET', {
      path: '/collections',
    })
    const filteredCollections = await permission.filter(collections)
    expect(filteredCollections).toEqual(
      userCollectionsPerRole('author', 'user3'),
    )
  })
  it('UI: sees the navigation links for Users', async () => {
    const permission = await authsome.can(
      'user3',
      'can view nav links',
      'users',
    )
    expect(permission).toBe(false)
  })
  it('UI: sees the navigation links for Teams', async () => {
    const permission = await authsome.can(
      'user3',
      'can view nav links',
      'teams',
    )
    expect(permission).toBe(false)
  })
  it('UI: sees the add button in dashboard', async () => {
    const permission = await authsome.can('user3', 'can add books')
    expect(permission).toBe(false)
  })
  it('UI: sees the rename button in dashboard', async () => {
    const permission = await authsome.can(
      'user3',
      'can rename books',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('UI: sees the delete button in dashboard', async () => {
    const permission = await authsome.can(
      'user3',
      'can delete books',
      collections[0],
    )
    expect(permission).toBe(false)
  })
})
