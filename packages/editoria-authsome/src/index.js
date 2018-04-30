const { pickBy } = require('lodash')

class EditoriaMode {
  /**
   * Creates a new instance of EditoriaMode
   *
   * @param {string} userId A user's UUID
   * @param {string} operation The operation you're authorizing for
   * @param {any} object The object of authorization
   * @param {any} context Context for authorization, e.g. database access
   * @returns {string}
   */
  constructor(userId, operation, object, context) {
    this.userId = userId
    this.operation = EditoriaMode.mapOperation(operation)
    this.object = object
    this.context = context
  }

  /**
   * Maps operations from HTTP verbs to semantic verbs
   *
   * @param {any} operation
   * @returns {string}
   */
  static mapOperation(operation) {
    const operationMap = {
      GET: 'read',
      POST: 'create',
      PATCH: 'update',
      DELETE: 'delete',
    }

    return operationMap[operation] ? operationMap[operation] : operation
  }

  async isTeamMember(teamType, object) {
    let membershipCondition
    if (object) {
      membershipCondition = team =>
        team.teamType === teamType &&
        team.object &&
        team.object.id === object.id
    } else {
      membershipCondition = team => team.teamType === teamType
    }

    const memberships = await Promise.all(
      this.user.teams.map(async teamId => {
        const teamFound = await this.context.models.Team.find(teamId)
        return membershipCondition(teamFound)
      }),
    )

    return memberships.includes(true)
  }

  async hasMembership(object) {
    const membershipCondition = team => team.object.id === object.id

    const memberships = await Promise.all(
      this.user.teams.map(async teamId => {
        const teamFound = await this.context.models.Team.find(teamId)
        return membershipCondition(teamFound)
      }),
    )
    return memberships.includes(true)
  }

  isAuthor(object) {
    return this.isTeamMember('author', object)
  }

  isAssignedCopyEditor(object) {
    return this.isTeamMember('copyEditor', object)
  }

  isAssignedProductionEditor(object) {
    return this.isTeamMember('productionEditor', object)
  }

  isProductionEditor() {
    return this.isTeamMember('productionEditor')
  }

  async canReadCollection() {
    this.user = await this.context.models.User.find(this.userId)

    const collection = await this.context.models.Collection.find(this.object.id)

    const permission =
      (await this.isAuthor(collection)) ||
      (await this.isAssignedCopyEditor(collection)) ||
      (await this.isAssignedProductionEditor(collection))

    return permission
  }

  async canListCollections() {
    this.user = await this.context.models.User.find(this.userId)

    return {
      filter: async collections => {
        const filteredCollections = await Promise.all(
          collections.map(async collection => {
            const condition =
              (await this.isAuthor(collection)) ||
              (await this.isAssignedCopyEditor(collection)) || // eslint-disable-line
              (await this.isAssignedProductionEditor(collection)) // eslint-disable-line
            return condition ? collection : undefined // eslint-disable-line
          }, this),
        )

        return filteredCollections.filter(collection => collection)
      },
    }
  }

  async canListFragments() {
    // if (!this.isAuthenticated()) {
    //   return false
    // }
    // this.user = await this.context.models.User.find(this.userId)
    // const collection = await this.context.models.Collection.find(this.object.book)
    // const condition =
    //           (await this.isAuthor(collection)) ||
    //           (await this.isAssignedCopyEditor(collection)) || // eslint-disable-line
    //           (await this.isAssignedProductionEditor(collection))
    // console.log('object', this.object)
    return true

    // return {
    //   filter: async collections => {
    //     const filteredCollections = await Promise.all(
    //       collections.map(async collection => {
    //         const condition =
    //           (await this.isAuthor(collection)) ||
    //           (await this.isAssignedCopyEditor(collection)) || // eslint-disable-line
    //           (await this.isAssignedProductionEditor(collection)) // eslint-disable-line
    //         return condition ? collection : undefined // eslint-disable-line
    //       }, this),
    //     )

    //     return filteredCollections.filter(collection => collection)
    //   },
    // }
  }

  async canReadFragment() {
    this.user = await this.context.models.User.find(this.userId)
    const collectionId = this.object.book
    const collection = await this.context.models.Collection.find(collectionId)
    const condition =
      (await this.isAuthor(collection)) ||
      (await this.isAssignedCopyEditor(collection)) || // eslint-disable-line
      (await this.isAssignedProductionEditor(collection))
    return condition
  }

  async canListUsers() {
    // this.user = await this.context.models.User.find(this.userId)
    // if (await this.isProductionEditor()) {
    //   return true
    // }
    // return {
    //   filter: async users => {
    //     const filteredUsers = await Promise.all(
    //       users.map(async team => {
    //         const condition = this.belongsToTeam(team.id)
    //         return condition ? team : undefined // eslint-disable-line
    //       }, this),
    //     )

    //     return filteredTeams.filter(team => team)
    //   },
    // }
    return true
  }

  async canReadUser() {
    this.user = await this.context.models.User.find(this.userId)

    if (this.user.id === this.object.id) {
      return true
    }
    return {
      filter: user =>
        pickBy(user, (_, key) => ['id', 'username', 'type'].includes(key)),
    }
  }

  async canListTeams() {
    this.user = await this.context.models.User.find(this.userId)

    return {
      filter: async teams => {
        const filteredTeams = await Promise.all(
          teams.map(async team => {
            const condition = this.belongsToTeam(team.id)
            return condition ? team : undefined
          }, this),
        )

        return filteredTeams.filter(team => team)
      },
    }
  }

  belongsToTeam(teamId) {
    return this.user.teams.includes(teamId)
  }

  async canReadTeam() {
    this.user = await this.context.models.User.find(this.userId)
    return this.belongsToTeam(this.object.id)
  }

  async canCreateTeam() {
    this.user = await this.context.models.User.find(this.userId)
    return this.isProductionEditor()
  }

  async canUpdateTeam() {
    this.user = await this.context.models.User.find(this.userId)
    const teamFound = await this.context.models.Team.find(this.object.id)
    const collection = await this.context.models.Collection.find(
      teamFound.object.id,
    )
    return this.isAssignedProductionEditor(collection)
  }

  async canCreateCollection() {
    this.user = await this.context.models.User.find(this.userId)
    return this.isProductionEditor()
  }

  async canUpdateCollection() {
    this.user = await this.context.models.User.find(this.userId)
    const collection = await this.context.models.Collection.find(this.object.id)
    return this.isAssignedProductionEditor(collection)
  }
  async canBroadcastEvent() {
    this.user = await this.context.models.User.find(this.userId)
    return this.hasMembership(this.object)
  }

  async canCreateFragment() {
    const { collection } = this.object
    this.user = await this.context.models.User.find(this.userId)
    const foundCollection = await this.context.models.Collection.find(
      collection.id,
    )
    const permissions =
      foundCollection &&
      ((await this.isAssignedProductionEditor(foundCollection)) ||
        (await this.isAssignedCopyEditor(foundCollection)))
    return permissions
  }

  async canViewAddComponent() {
    this.user = await this.context.models.User.find(this.userId)
    const foundCollection = await this.context.models.Collection.find(
      this.object.id,
    )
    const permissions =
      foundCollection &&
      ((await this.isAssignedProductionEditor(foundCollection)) ||
        (await this.isAssignedCopyEditor(foundCollection)))
    return permissions
  }
  async canViewDeleteComponent() {
    this.user = await this.context.models.User.find(this.userId)
    const foundCollection = await this.context.models.Collection.find(
      this.object.book,
    )
    const permissions =
      foundCollection &&
      ((await this.isAssignedProductionEditor(foundCollection)) ||
        (await this.isAssignedCopyEditor(foundCollection)))
    return permissions
  }
  async canDeleteFragment() {
    this.user = await this.context.models.User.find(this.userId)
    const collectionId = this.object.book
    const foundCollection = await this.context.models.Collection.find(
      collectionId,
    )
    const permissions =
      foundCollection &&
      ((await this.isAssignedProductionEditor(foundCollection)) ||
        (await this.isAssignedCopyEditor(foundCollection)))
    return permissions
  }

  async canUpdateFragment() {
    console.log('this object', this.object)
    this.user = await this.context.models.User.find(this.userId)
    const collectionId = this.object.book
    const foundCollection = await this.context.models.Collection.find(
      collectionId,
    )
    const permissions =
      foundCollection &&
      ((await this.isAssignedProductionEditor(foundCollection)) ||
        (await this.isAssignedCopyEditor(foundCollection)))
    return permissions
  }

  async canBroadcastFragmentPatchEvent() {
    this.user = await this.context.models.User.find(this.userId)
    const foundFragment = await this.context.models.Fragment.find(
      this.object.id,
    )
    const foundCollection = await this.context.models.Collection.find(
      foundFragment.book,
    )
    return (
      foundFragment && foundCollection && this.hasMembership(foundCollection)
    )
  }
  async canFragmentEdit() {
    this.user = await this.context.models.User.find(this.userId)
    const fragment = this.object
    const collectionId = fragment.book
    const isEditingSate = fragment.progress.edit === 1
    const isReviewingSate = fragment.progress.review === 1

    const foundCollection = await this.context.models.Collection.find(
      collectionId,
    )
    if (foundCollection) {
      if (await this.isAssignedProductionEditor(foundCollection)) {
        return true
      } else if (
        (await this.isAssignedCopyEditor(foundCollection)) &&
        isEditingSate
      ) {
        return true
      } else if ((await this.isAuthor(foundCollection)) && isReviewingSate) {
        return true
      }
    }
    return false
  }

  async canChangeProgress() {
    this.user = await this.context.models.User.find(this.userId)
    const collectionId = this.object.bookId
    const progressType = this.object.name
    const currentValue = this.object.currentValueIndex
    const isEditingSate = progressType === 'edit' && currentValue === 1
    const isReviewingSate = progressType === 'review' && currentValue === 1

    const foundCollection = await this.context.models.Collection.find(
      collectionId,
    )
    if (foundCollection) {
      if (await this.isAssignedProductionEditor(foundCollection)) {
        return true
      } else if (
        (await this.isAssignedCopyEditor(foundCollection)) &&
        progressType === 'edit' &&
        isEditingSate
      ) {
        return true
      } else if (
        (await this.isAuthor(foundCollection)) &&
        progressType === 'review' &&
        isReviewingSate
      ) {
        return true
      }
    }
    return false
  }

  async canUploadMultipleFiles() {
    this.user = await this.context.models.User.find(this.userId)
    const collectionId = this.object.id
    const foundCollection = await this.context.models.Collection.find(
      collectionId,
    )
    const permissions =
      foundCollection &&
      ((await this.isAssignedProductionEditor(foundCollection)) ||
        (await this.isAssignedCopyEditor(foundCollection)))
    return permissions
  }
}

module.exports = {
  before: async (userId, operation, object, context) => {
    const user = await context.models.User.find(userId)
    return user && user.admin
  },
  GET: (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)

    // GET /api/collections
    if (object && object.path === '/collections') {
      return mode.canListCollections()
    }
    // GET /api/collection
    if (object && object.type === 'collection') {
      return mode.canReadCollection()
    }

    // GET /api/collections/:collectionId/fragments
    if (object && object.path === '/fragments') {
      return mode.canListFragments()
    }
    // GET /api/collections/:collectionId/fragments/:fragmentId
    if (object && object.type === 'fragment') {
      return mode.canReadFragment()
    }

    // GET /api/users
    if (object && object.path === '/users') {
      return mode.canListUsers()
    }

    // // GET /api/teams
    if (object && object.path === '/teams') {
      return mode.canListTeams()
    }

    // // GET /api/team
    if (object && object.type === 'team') {
      return mode.canReadTeam()
    }

    // // GET /api/user
    if (object && object.type === 'user') {
      return mode.canReadUser()
    }

    return false
  },
  POST: (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    // POST /api/collections
    if (object && object.path === '/collections') {
      return mode.canCreateCollection()
    }
    // POST /api/users
    if (object && object.path === '/users') {
      return true
    }
    // POST /api/fragments
    if (object && object.path === '/collections/:collectionId/fragments') {
      return mode.canCreateFragment()
    }
    // POST /api/teams
    if (object && object.path === '/teams') {
      return mode.canCreateTeam()
    }

    return false
  },
  PATCH: (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    // PATCH /api/collections/:id
    if (object && object.type === 'collection') {
      return mode.canUpdateCollection()
    }
    // PATCH /api/fragments/:id
    if (object && object.type === 'fragment') {
      return mode.canUpdateFragment()
    }
    // PATCH /api/teams/:id
    if (object && object.type === 'team') {
      return mode.canUpdateTeam()
    }

    return false
  },
  DELETE: (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    // DELETE /api/collections/:id
    if (object && object.type === 'collection') {
      return mode.canUpdateCollection()
    }
    // DELETE /api/fragments/:id
    if (object && object.type === 'fragment') {
      return mode.canDeleteFragment()
    }

    // DELETE /api/teams/:id
    if (object && object.type === 'team') {
      return mode.canUpdateTeam()
    }

    return false
  },
  'can view nav links': (userId, operation, object, context) => false,
  'can add books': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canCreateCollection()
  },
  'can rename books': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canUpdateCollection()
  },
  'can delete books': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canUpdateCollection()
  },
  'can view teamManager': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canUpdateCollection()
  },
  'can view addComponent': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canViewAddComponent()
  },
  'can view deleteComponent': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canViewDeleteComponent()
  },
  'can view uploadButton': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canUpdateCollection()
  },
  'can view alignmentTool': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canUpdateCollection()
  },
  'can view fragmentEdit': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canFragmentEdit()
  },
  'can reoder bookComponents': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    // make some methods reusable
    return mode.canUploadMultipleFiles()
  },
  'can change progressList': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canChangeProgress()
  },
  'can view multipleFilesUpload': (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    return mode.canUploadMultipleFiles()
  },
  'collection:create': (userId, operation, object, context) => {
    const { collection } = object
    const mode = new EditoriaMode(userId, operation, collection, context)
    return collection.owners.includes(userId) || mode.canBroadcastEvent()
  },
  'collection:patch': (userId, operation, object, context) => {
    const { collection } = object
    const mode = new EditoriaMode(userId, operation, collection, context)
    return mode.canBroadcastEvent()
  },
  'collection:delete': (userId, operation, object, context) => true,
  'fragment:create': (userId, operation, object, context) => {
    const { collection } = object
    const mode = new EditoriaMode(userId, operation, collection, context)
    return mode.canBroadcastEvent()
  },
  'fragment:patch': (userId, operation, object, context) => {
    const { fragment } = object
    const mode = new EditoriaMode(userId, operation, fragment, context)
    return mode.canBroadcastFragmentPatchEvent()
  },
  'fragment:delete': (userId, operation, object, context) => {
    const { collection } = object
    const mode = new EditoriaMode(userId, operation, collection, context)
    return mode.canBroadcastEvent()
  },
  // TODO protect ink endpoint
}
