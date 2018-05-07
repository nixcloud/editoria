const Authsome = require('authsome')

const authsomeConfig = require('./teams-config')

const {
  collections,
  fragments,
  updatedCollectionTitle,
  users,
  updateFragmentSource,
  teams,
  updateFragmentOrder,
  updateFragmentPage,
  updateFragmentProgressEdit,
  updateFragmentProgressReview,
  updateFragmentProgressEditCP,
  updateFragmentProgressReviewAU,
  updateTeam,
  updateFragmentLock,
  updateFragmentMultipleProperties,
  updateFragmentTrackChanges,
  updateFragmentTrackChangesCP,
} = require('./fixtures/fixtures')

const {
  userCollections,
  findTeamsPerUser,
  findUser,
} = require('./helpers/utils')

const authsome = new Authsome(
  { mode: require('../src/index'), ...authsomeConfig },
  {
    models: {
      User: { find: id => users.find(user => user.id === id) },
      Team: { find: id => teams.find(team => team.id === id) },
      Collection: {
        find: id => collections.find(collection => collection.id === id),
      },
      Fragment: {
        find: id => fragments.find(fragment => fragment.id === id),
      },
    },
  },
)

describe('Admin', () => {
  const adminUser = findUser('adminId')

  it('allows everything to an admin', async () => {
    const permission = await authsome.can(
      adminUser.id,
      'DELETE',
      'thisSensitiveThing',
    )
    expect(permission).toBe(true)
  })
})

describe('Random Authanticated User', () => {
  const genericUser = findUser('user')

  it('lists all the collections where she/he is assigned to', async () => {
    const permission = await authsome.can(genericUser.id, 'GET', {
      path: '/collections',
    })
    const filteredCollections = await permission.filter(collections)
    expect(filteredCollections).toEqual(userCollections(genericUser.id))
  })

  it('could not get the available teams of the system if she/he is not a member', async () => {
    const permission = await authsome.can(genericUser.id, 'GET', {
      path: '/teams',
    })
    const filteredTeams = await permission.filter(teams)
    expect(filteredTeams).toEqual([])
  })

  it('could get the available users of the system', async () => {
    const permission = await authsome.can(genericUser.id, 'GET', {
      path: '/users',
    })
    expect(permission).toBe(true)
  })

  it('could not read a collection she/he is not assigned to', async () => {
    const permission = await authsome.can(genericUser.id, 'GET', collections[0])
    expect(permission).toBe(false)
  })

  it('could not read a team she/he is not member to', async () => {
    const permission = await authsome.can(genericUser.id, 'GET', teams[0])
    expect(permission).toBe(false)
  })

  it('could not read other users', async () => {
    const permission = await authsome.can(genericUser.id, 'GET', users[1])
    const filteredUsers = await permission.filter(users)
    expect(filteredUsers).toEqual({})
  })
  it('could read hers/his user profile', async () => {
    const permission = await authsome.can(genericUser.id, 'GET', users[0])
    expect(permission).toBe(true)
  })
  it('could not create collection if she/he does not have the right permissions', async () => {
    const permission = await authsome.can(genericUser.id, 'POST', {
      path: '/collections',
    })
    expect(permission).toBe(false)
  })

  it('could not create teams ', async () => {
    const permission = await authsome.can(genericUser.id, 'POST', {
      path: '/teams',
    })
    expect(permission).toBe(false)
  })

  it('could not update collection if she/he is not in the correct team', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'PATCH',
      updatedCollectionTitle,
    )
    expect(permission).toBe(false)
  })
  it('could not update teams if she/he is not the Production Editor of the collection', async () => {
    const permission = await authsome.can(genericUser.id, 'PATCH', updateTeam)
    expect(permission).toBe(false)
  })

  it('could not delete a collection if she/he is not member of a team with the right permissions', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'DELETE',
      collections[1],
    )
    expect(permission).toBe(false)
  })

  it('could not delete teams ', async () => {
    const permission = await authsome.can(genericUser.id, 'DELETE', teams[0])
    expect(permission).toBe(false)
  })

  it('could not accept collection:create if she/he is unassigned', async () => {
    const permission = await authsome.can(genericUser.id, 'collection:create', {
      collection: collections[0],
    })
    expect(permission).toBe(false)
  })

  it('could not accept collection:patch if she/he is unassigned', async () => {
    const permission = await authsome.can(genericUser.id, 'collection:patch', {
      collection: collections[0],
    })
    expect(permission).toBe(false)
  })

  it('accepts collection:delete', async () => {
    const permission = await authsome.can(genericUser.id, 'collection:delete', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })
  it('could not accept fragment:create if she/he is unassigned', async () => {
    const permission = await authsome.can(genericUser.id, 'fragment:create', {
      collection: collections[0],
    })
    expect(permission).toBe(false)
  })

  it('could not accept fragment:patch if she/he is unassigned', async () => {
    const permission = await authsome.can(genericUser.id, 'fragment:patch', {
      fragment: fragments[0],
    })
    expect(permission).toBe(false)
  })

  it('could accept fragment:delete', async () => {
    const permission = await authsome.can(genericUser.id, 'fragment:delete', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })

  it('could not read the fragments of a collection if she/he has no membership', async () => {
    const permission = await authsome.can(genericUser.id, 'GET', fragments[0])
    expect(permission).toBe(false)
  })

  it('creates user', async () => {
    const permission = await authsome.can(genericUser.id, 'POST', {
      path: '/users',
    })
    expect(permission).toBe(true)
  })

  it('could not view team manager if she/he is not production editor of collection', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can view teamManager',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view Teams and Users', async () => {
    const permission = await authsome.can(genericUser.id, 'can view nav links')
    expect(permission).toBe(false)
  })
  it('could not create a fragment', async () => {
    const permission = await authsome.can(genericUser.id, 'POST', {
      path: '/collections/:collectionId/fragments',
      collection: collections[0],
      fragment: fragments[0],
    })
    expect(permission).toBe(false)
  })
  it('could not update a fragment', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'PATCH',
      updateFragmentSource,
    )
    expect(permission).toBe(false)
  })
  it('could not delete a fragment', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'DELETE',
      fragments[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view addComponent', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can view addComponent',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view deleteComponent', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can view deleteComponent',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view uploadButton', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can view uploadButton',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view alignmentTool', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can view alignmentTool',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view fragmentEdit', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can view fragmentEdit',
      fragments[0],
    )
    expect(permission).toBe(false)
  })
  it('could not reorder bookComponents', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can reorder bookComponents',
      fragments[0],
    )
    expect(permission).toBe(false)
  })
  it('could not change progressList', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can change progressList',
      fragments[0],
    )
    expect(permission).toBe(false)
  })
  it('could not rename collections', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can rename books',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not use for editing', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can use for editing',
      fragments[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view multipleFilesUpload', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can view multipleFilesUpload',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view add books', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can add books',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could accept team:create', async () => {
    const permission = await authsome.can(genericUser.id, 'team:create', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })

  it('could accept team:patch', async () => {
    const permission = await authsome.can(genericUser.id, 'team:patch', {
      fragment: fragments[0],
    })
    expect(permission).toBe(true)
  })

  it('could accept team:delete', async () => {
    const permission = await authsome.can(genericUser.id, 'team:delete', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })
  it('could not toggle track changes', async () => {
    const permission = await authsome.can(
      genericUser.id,
      'can toggle track changes',
      fragments[1],
    )
    expect(permission).toBe(false)
  })
})

describe('Production Editor', () => {
  const productionEditor = findUser('user1')
  it('lists all the collections where she/he is assigned to', async () => {
    const permission = await authsome.can(productionEditor.id, 'GET', {
      path: '/collections',
    })
    const filteredCollections = await permission.filter(collections)
    expect(filteredCollections).toEqual(userCollections(productionEditor.id))
  })
  it('lists all the fragments where she/he is assigned to', async () => {
    const permission = await authsome.can(productionEditor.id, 'GET', {
      path: '/fragments',
    })
    expect(permission).toBe(true)
  })
  it('could get the available teams of the system if she/he is a member', async () => {
    const permission = await authsome.can(productionEditor.id, 'GET', {
      path: '/teams',
    })
    const filteredTeams = await permission.filter(teams)
    expect(filteredTeams).toEqual(findTeamsPerUser(productionEditor.id))
  })

  it('could get the available users of the system', async () => {
    const permission = await authsome.can(productionEditor.id, 'GET', {
      path: '/users',
    })
    expect(permission).toBe(true)
  })
  it('could view add books', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can add books',
      collections[0],
    )
    expect(permission).toBe(true)
  })

  it('could read a collection she/he is assigned to', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'GET',
      collections[0],
    )
    expect(permission).toBe(true)
  })

  it('could read a team she/he where she/he is member of', async () => {
    const permission = await authsome.can(productionEditor.id, 'GET', teams[0])
    expect(permission).toBe(true)
  })

  it('could not read other users', async () => {
    const permission = await authsome.can(productionEditor.id, 'GET', users[0])
    const filteredUsers = await permission.filter(users)
    expect(filteredUsers).toEqual({})
  })

  it('could create collection', async () => {
    const permission = await authsome.can(productionEditor.id, 'POST', {
      path: '/collections',
    })
    expect(permission).toBe(true)
  })

  it('could create teams ', async () => {
    const permission = await authsome.can(productionEditor.id, 'POST', {
      path: '/teams',
    })
    expect(permission).toBe(true)
  })

  it('could update collection', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'PATCH',
      updatedCollectionTitle,
    )
    expect(permission).toBe(true)
  })
  it('could update teams', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'PATCH',
      updateTeam,
    )
    expect(permission).toBe(true)
  })
  it('could rename collections', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can rename books',
      collections[0],
    )
    expect(permission).toBe(true)
  })

  it('could delete a collection if she/he is member of a team with the right permissions', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'DELETE',
      collections[0],
    )
    expect(permission).toBe(true)
  })

  it('could delete teams ', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'DELETE',
      teams[0],
    )
    expect(permission).toBe(true)
  })

  it('could accept collection:create', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'collection:create',
      {
        collection: collections[0],
      },
    )
    expect(permission).toBe(true)
  })

  it('could accept collection:patch', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'collection:patch',
      {
        collection: collections[0],
      },
    )
    expect(permission).toBe(true)
  })

  it('accepts collection:delete', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'collection:delete',
      {
        collection: collections[0],
      },
    )
    expect(permission).toBe(true)
  })
  it('could accept fragment:create', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'fragment:create',
      {
        collection: collections[0],
      },
    )
    expect(permission).toBe(true)
  })

  it('could accept fragment:patch', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'fragment:patch',
      {
        fragment: fragments[0],
      },
    )
    expect(permission).toBe(true)
  })

  it('could accept fragment:delete', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'fragment:delete',
      {
        collection: collections[0],
      },
    )
    expect(permission).toBe(true)
  })

  it('could read the fragments of a collection if she/he has', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'GET',
      fragments[0],
    )
    expect(permission).toBe(true)
  })

  it('creates user', async () => {
    const permission = await authsome.can(productionEditor.id, 'POST', {
      path: '/users',
    })
    expect(permission).toBe(true)
  })

  it('could view team manager', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can view teamManager',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could create a fragment', async () => {
    const permission = await authsome.can(productionEditor.id, 'POST', {
      path: '/collections/:collectionId/fragments',
      collection: collections[0],
      fragment: fragments[0],
    })
    expect(permission).toBe(true)
  })
  it('could update a fragment', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'PATCH',
      updateFragmentSource,
    )
    expect(permission).toBe(true)
  })
  it('could delete a fragment', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'DELETE',
      fragments[0],
    )
    expect(permission).toBe(true)
  })
  it('could view addComponent', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can view addComponent',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could view deleteComponent', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can view deleteComponent',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could view delete collection', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can delete books',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could view uploadButton', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can view uploadButton',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could view alignmentTool', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can view alignmentTool',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could view fragmentEdit', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can view fragmentEdit',
      fragments[0],
    )
    expect(permission).toBe(true)
  })
  it('could reorder bookComponents', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can reorder bookComponents',
      fragments[0],
    )
    expect(permission).toBe(true)
  })
  it('could change progressList', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can change progressList',
      fragments[0],
    )
    expect(permission).toBe(true)
  })
  it('could use wax for editing', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can use for editing',
      fragments[0],
    )
    expect(permission).toBe(true)
  })
  it('could view multipleFilesUpload', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can view multipleFilesUpload',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could toggle track changes', async () => {
    const permission = await authsome.can(
      productionEditor.id,
      'can toggle track changes',
      fragments[1],
    )
    expect(permission).toBe(true)
  })
})

describe('Corrupted Cases', () => {
  const genericUser = findUser('user')
  it('GET', async () => {
    const permission = await authsome.can(genericUser.id, 'GET')
    expect(permission).toBe(false)
  })
  it('GET with typo in object type', async () => {
    const permission = await authsome.can(genericUser.id, 'GET', {
      type: 'teams',
    })
    expect(permission).toBe(false)
  })
  it('PATCH', async () => {
    const permission = await authsome.can(genericUser.id, 'PATCH')
    expect(permission).toBe(false)
  })
  it('PATCH fragment for incorrect collection', async () => {
    const permission = await authsome.can(genericUser.id, 'PATCH', {
      current: {
        id: '345gsdf',
        type: 'fragment',
        progress: {
          edit: 1,
          review: 1,
        },
      },
      update: updateFragmentSource,
    })
    expect(permission).toBe(false)
  })
  it('POST', async () => {
    const permission = await authsome.can(genericUser.id, 'POST')
    expect(permission).toBe(false)
  })
  it('Read fragment with user with corrupt teams', async () => {
    const permission = await authsome.can('userWrongTeam', 'GET', fragments[0])
    expect(permission).toBe(false)
  })
  it('DELETE', async () => {
    const permission = await authsome.can(genericUser.id, 'DELETE')
    expect(permission).toBe(false)
  })
  it('NO USER', async () => {
    const permission = await authsome.can(null, 'GET')
    expect(permission).toBe(false)
  })
  it('could not accept collection:patch with corrupted teams for user', async () => {
    const permission = await authsome.can('userWrongTeam', 'collection:patch', {
      collection: collections[0],
    })
    expect(permission).toBe(false)
  })
})

describe('Copy Editor', () => {
  const copyEditor = findUser('user2')

  it('lists all the collections where she/he is assigned to', async () => {
    const permission = await authsome.can(copyEditor.id, 'GET', {
      path: '/collections',
    })
    const filteredCollections = await permission.filter(collections)
    expect(filteredCollections).toEqual(userCollections(copyEditor.id))
  })
  it('lists all the fragments where she/he is assigned to', async () => {
    const permission = await authsome.can(copyEditor.id, 'GET', {
      path: '/fragments',
    })
    expect(permission).toBe(true)
  })

  it('could get the available teams of the system', async () => {
    const permission = await authsome.can(copyEditor.id, 'GET', {
      path: '/teams',
    })
    const filteredTeams = await permission.filter(teams)
    expect(filteredTeams).toEqual(findTeamsPerUser(copyEditor.id))
  })

  it('could get the available users of the system', async () => {
    const permission = await authsome.can(copyEditor.id, 'GET', {
      path: '/users',
    })
    expect(permission).toBe(true)
  })

  it('could read a collection she/he is assigned to', async () => {
    const permission = await authsome.can(copyEditor.id, 'GET', collections[0])
    expect(permission).toBe(true)
  })

  it('could not read a team she/he is not member to', async () => {
    const permission = await authsome.can(copyEditor.id, 'GET', teams[0])
    expect(permission).toBe(false)
  })

  it('could not read other users', async () => {
    const permission = await authsome.can(copyEditor.id, 'GET', users[1])
    const filteredUsers = await permission.filter(users)
    expect(filteredUsers).toEqual({})
  })

  it('could not create collection if she/he does not have the right permissions', async () => {
    const permission = await authsome.can(copyEditor.id, 'POST', {
      path: '/collections',
    })
    expect(permission).toBe(false)
  })

  it('could not create teams ', async () => {
    const permission = await authsome.can(copyEditor.id, 'POST', {
      path: '/teams',
    })
    expect(permission).toBe(false)
  })

  it('could not update collection if she/he is not in the correct team', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'PATCH',
      updatedCollectionTitle,
    )
    expect(permission).toBe(false)
  })
  it('could not update teams if she/he is not the Production Editor of the collection', async () => {
    const permission = await authsome.can(copyEditor.id, 'PATCH', updateTeam)
    expect(permission).toBe(false)
  })

  it('could not delete a collection if she/he is not member of a team with the right permissions', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'DELETE',
      collections[1],
    )
    expect(permission).toBe(false)
  })

  it('could not delete teams ', async () => {
    const permission = await authsome.can(copyEditor.id, 'DELETE', teams[0])
    expect(permission).toBe(false)
  })

  it('could accept collection:create', async () => {
    const permission = await authsome.can(copyEditor.id, 'collection:create', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })

  it('could accept collection:patch', async () => {
    const permission = await authsome.can(copyEditor.id, 'collection:patch', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })

  it('accepts collection:delete', async () => {
    const permission = await authsome.can(copyEditor.id, 'collection:delete', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })
  it('could accept fragment:create', async () => {
    const permission = await authsome.can(copyEditor.id, 'fragment:create', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })

  it('could accept fragment:patch', async () => {
    const permission = await authsome.can(copyEditor.id, 'fragment:patch', {
      fragment: fragments[0],
    })
    expect(permission).toBe(true)
  })

  it('could accept fragment:delete', async () => {
    const permission = await authsome.can(copyEditor.id, 'fragment:delete', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })

  it('could read the fragments of a collection', async () => {
    const permission = await authsome.can(copyEditor.id, 'GET', fragments[0])
    expect(permission).toBe(true)
  })

  it('could not view team manager', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can view teamManager',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could create a fragment', async () => {
    const permission = await authsome.can(copyEditor.id, 'POST', {
      path: '/collections/:collectionId/fragments',
      collection: collections[0],
      fragment: fragments[0],
    })
    expect(permission).toBe(true)
  })
  it('could make comments to a fragment', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'PATCH',
      updateFragmentSource,
    )
    expect(permission).toBe(true)
  })
  it('could only change mode from Editing to Edited', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'PATCH',
      updateFragmentProgressEditCP,
    )
    expect(permission).toBe(true)
  })
  it('could reorder fragments (patch)', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'PATCH',
      updateFragmentOrder,
    )
    expect(permission).toBe(true)
  })
  it('could change page alignment (patch)', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'PATCH',
      updateFragmentPage,
    )
    expect(permission).toBe(true)
  })
  it('could get fragment lock when fragment mode is Editing', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'PATCH',
      updateFragmentLock,
    )
    expect(permission).toBe(true)
  })
  it('could not change mode when not Editing', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'PATCH',
      updateFragmentProgressEdit,
    )
    expect(permission).toBe(false)
  })
  it('could delete a fragment', async () => {
    const permission = await authsome.can(copyEditor.id, 'DELETE', fragments[0])
    expect(permission).toBe(true)
  })
  it('could view addComponent', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can view addComponent',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could view deleteComponent', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can view deleteComponent',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could view uploadButton', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can view uploadButton',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could view alignmentTool', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can view alignmentTool',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could view fragmentEdit when fragment mode is Editing', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can view fragmentEdit',
      fragments[2],
    )
    expect(permission).toBe(true)
  })
  it('could reorder bookComponents', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can reorder bookComponents',
      fragments[0],
    )
    expect(permission).toBe(true)
  })
  it('could change progressList only when fragment mode is Editing', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can change progressList',
      {
        name: 'edit',
        currentValueIndex: 1,
        type: 'fragment',
        bookId: fragments[2].book,
      },
    )
    expect(permission).toBe(true)
  })
  it('could use wax for editing only when fragment mode is Editing', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can use for editing',
      fragments[2],
    )
    expect(permission).toBe(true)
  })
  it('could view multipleFilesUpload', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can view multipleFilesUpload',
      collections[0],
    )
    expect(permission).toBe(true)
  })
  it('could not toggle track changes if not in editing', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can toggle track changes',
      fragments[1],
    )
    expect(permission).toBe(false)
  })
  it('could toggle track changes when in editing', async () => {
    const permission = await authsome.can(
      copyEditor.id,
      'can toggle track changes',
      fragments[2],
    )
    expect(permission).toBe(true)
  })
})

describe('Author', () => {
  const author = findUser('user3')
  it('lists all the collections where she/he is assigned to', async () => {
    const permission = await authsome.can(author.id, 'GET', {
      path: '/collections',
    })
    const filteredCollections = await permission.filter(collections)
    expect(filteredCollections).toEqual(userCollections(author.id))
  })
  it('lists all the fragments where she/he is assigned to', async () => {
    const permission = await authsome.can(author.id, 'GET', {
      path: '/fragments',
    })
    expect(permission).toBe(true)
  })

  it('could get the available teams of the system', async () => {
    const permission = await authsome.can(author.id, 'GET', {
      path: '/teams',
    })
    const filteredTeams = await permission.filter(teams)
    expect(filteredTeams).toEqual(findTeamsPerUser(author.id))
  })

  it('could get the available users of the system', async () => {
    const permission = await authsome.can(author.id, 'GET', {
      path: '/users',
    })
    expect(permission).toBe(true)
  })

  it('could read a collection she/he is assigned to', async () => {
    const permission = await authsome.can(author.id, 'GET', collections[0])
    expect(permission).toBe(true)
  })

  it('could not read a team she/he is not member to', async () => {
    const permission = await authsome.can(author.id, 'GET', teams[0])
    expect(permission).toBe(false)
  })

  it('could not read other users', async () => {
    const permission = await authsome.can(author.id, 'GET', users[1])
    const filteredUsers = await permission.filter(users)
    expect(filteredUsers).toEqual({})
  })

  it('could not create collection if she/he does not have the right permissions', async () => {
    const permission = await authsome.can(author.id, 'POST', {
      path: '/collections',
    })
    expect(permission).toBe(false)
  })

  it('could not create teams ', async () => {
    const permission = await authsome.can(author.id, 'POST', {
      path: '/teams',
    })
    expect(permission).toBe(false)
  })

  it('could not update collection if she/he is not in the correct team', async () => {
    const permission = await authsome.can(
      author.id,
      'PATCH',
      updatedCollectionTitle,
    )
    expect(permission).toBe(false)
  })
  it('could not update teams if she/he is not the Production Editor of the collection', async () => {
    const permission = await authsome.can(author.id, 'PATCH', updateTeam)
    expect(permission).toBe(false)
  })

  it('could not delete a collection if she/he is not member of a team with the right permissions', async () => {
    const permission = await authsome.can(author.id, 'DELETE', collections[1])
    expect(permission).toBe(false)
  })

  it('could not delete teams', async () => {
    const permission = await authsome.can(author.id, 'DELETE', teams[0])
    expect(permission).toBe(false)
  })

  it('could accept collection:create', async () => {
    const permission = await authsome.can(author.id, 'collection:create', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })

  it('could accept collection:patch', async () => {
    const permission = await authsome.can(author.id, 'collection:patch', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })

  it('accepts collection:delete', async () => {
    const permission = await authsome.can(author.id, 'collection:delete', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })
  it('could accept fragment:create', async () => {
    const permission = await authsome.can(author.id, 'fragment:create', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })

  it('could accept fragment:patch', async () => {
    const permission = await authsome.can(author.id, 'fragment:patch', {
      fragment: fragments[0],
    })
    expect(permission).toBe(true)
  })

  it('could accept fragment:delete', async () => {
    const permission = await authsome.can(author.id, 'fragment:delete', {
      collection: collections[0],
    })
    expect(permission).toBe(true)
  })

  it('could read the fragments of a collection', async () => {
    const permission = await authsome.can(author.id, 'GET', fragments[0])
    expect(permission).toBe(true)
  })

  it('could not view team manager', async () => {
    const permission = await authsome.can(
      author.id,
      'can view teamManager',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could create a fragment', async () => {
    const permission = await authsome.can(author.id, 'POST', {
      path: '/collections/:collectionId/fragments',
      collection: collections[0],
      fragment: fragments[0],
    })
    expect(permission).toBe(false)
  })
  it('could make comments to a fragment', async () => {
    const permission = await authsome.can(
      author.id,
      'PATCH',
      updateFragmentSource,
    )
    expect(permission).toBe(true)
  })
  it('could only change mode from Reviewing to Reviewed', async () => {
    const permission = await authsome.can(
      author.id,
      'PATCH',
      updateFragmentProgressReviewAU,
    )
    expect(permission).toBe(true)
  })
  it('could reorder fragments (patch)', async () => {
    const permission = await authsome.can(
      author.id,
      'PATCH',
      updateFragmentOrder,
    )
    expect(permission).toBe(false)
  })
  it('could change page alignment (patch)', async () => {
    const permission = await authsome.can(
      author.id,
      'PATCH',
      updateFragmentPage,
    )
    expect(permission).toBe(false)
  })
  it('could get fragment lock when fragment mode is Reviewing', async () => {
    const permission = await authsome.can(
      author.id,
      'PATCH',
      updateFragmentLock,
    )
    expect(permission).toBe(true)
  })
  it('could not change mode when not Reviewing', async () => {
    const permission = await authsome.can(
      author.id,
      'PATCH',
      updateFragmentProgressReview,
    )
    expect(permission).toBe(false)
  })
  it('could not delete a fragment', async () => {
    const permission = await authsome.can(author.id, 'DELETE', fragments[0])
    expect(permission).toBe(false)
  })
  it('could not view addComponent', async () => {
    const permission = await authsome.can(
      author.id,
      'can view addComponent',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view deleteComponent', async () => {
    const permission = await authsome.can(
      author.id,
      'can view deleteComponent',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view uploadButton', async () => {
    const permission = await authsome.can(
      author.id,
      'can view uploadButton',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not view alignmentTool', async () => {
    const permission = await authsome.can(
      author.id,
      'can view alignmentTool',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could view fragmentEdit when fragment mode is Reviewing', async () => {
    const permission = await authsome.can(
      author.id,
      'can view fragmentEdit',
      fragments[2],
    )
    expect(permission).toBe(true)
  })
  it('could view fragmentEdit when fragment mode is not Reviewing', async () => {
    const permission = await authsome.can(
      author.id,
      'can view fragmentEdit',
      fragments[0],
    )
    expect(permission).toBe(false)
  })
  it('could reorder bookComponents', async () => {
    const permission = await authsome.can(
      author.id,
      'can reorder bookComponents',
      fragments[0],
    )
    expect(permission).toBe(false)
  })
  it('could change progressList only when fragment mode is Reviewing', async () => {
    const permission = await authsome.can(
      author.id,
      'can change progressList',
      {
        name: 'review',
        currentValueIndex: 1,
        type: 'fragment',
        book: fragments[2].book,
      },
    )
    expect(permission).toBe(true)
  })
  it('could use wax for editing only when fragment mode is Reviewing', async () => {
    const permission = await authsome.can(
      author.id,
      'can use for editing',
      fragments[2],
    )
    expect(permission).toBe(true)
  })
  it('could not view multipleFilesUpload', async () => {
    const permission = await authsome.can(
      author.id,
      'can view multipleFilesUpload',
      collections[0],
    )
    expect(permission).toBe(false)
  })
  it('could not update multiple properties of fragments', async () => {
    const permission = await authsome.can(
      author.id,
      'PATCH',
      updateFragmentMultipleProperties[0],
    )
    expect(permission).toBe(false)
  })
  it('could not toggle track changes', async () => {
    const permission = await authsome.can(
      author.id,
      'can toggle track changes',
      fragments[1],
    )
    expect(permission).toBe(false)
  })
})
