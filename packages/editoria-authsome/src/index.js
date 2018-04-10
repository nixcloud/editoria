const { pickBy } = require('lodash')
/** The base class for Editoria's Authsome mode. */
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

  /**
   * Checks if user is a member of a team of a certain type for a certain object
   *
   * @param {any} user
   * @param {any} teamType
   * @param {any} object
   * @returns {boolean}
   */
  async isTeamMember(teamType, object) {
    console.log('user', this.user)
    if (!this.user || !Array.isArray(this.user.teams)) {
      console.log('in teamMemeber false1')
      return false
    }

    let membershipCondition
    if (object) {
      // We're asking if a user is a member of a team for a specific object
      membershipCondition = team =>
        team.teamType === teamType &&
        team.object &&
        team.object.id === object.id
    } else {
      // We're asking if a user is a member of a global team
      // membershipCondition = team => team.teamType === teamType && !team.object// later when globals will be introduced
      membershipCondition = team => team.teamType === teamType
    }

    const memberships = await Promise.all(
      this.user.teams.map(async teamId => {
        console.log('in teamMemeber user.teams.map', teamId)
        const teamFound = await this.context.models.Team.find(teamId)
        console.log('in teamMemeber teamFound', teamFound)
        return membershipCondition(teamFound)
      }),
    )
    console.log('membership', memberships)

    return memberships.includes(true)
  }

  /**
   * Returns permissions for unauthenticated users
   *
   * @param {any} operation
   * @param {any} object
   * @returns {boolean}
   */
  unauthenticatedUser(object) {
    return this.operation === '/login'
  }

  /**
   * Checks if the user is an author, as represented with the owners
   * relationship
   *
   * @param {any} object
   * @returns {boolean}
   */
  isAuthor(object) {
    return this.isTeamMember('author', object)
  }

  /**
   * Checks if the user is an author, as represented with the owners
   * relationship
   *
   * @returns {boolean}
   */
  isAdmin() {
    if (this.user && this.user.admin) {
      return true
    }
    return false
  }

  /**
   * Checks if user is a senior editor (member of a team of type senior editor) for an object
   *
   * @returns {boolean}
   */
  isAssignedCopyEditor(object) {
    return this.isTeamMember('copyEditor', object)
  }

  isAssignedProductionEditor(object) {
    return this.isTeamMember('productionEditor', object)
  }

  /**
   * Checks if user is a senior editor (member of a team of type senior editor) for an object
   *
   * @returns {boolean}
   */
  isProductionEditor() {
    console.log('isProduction?', this.isTeamMember('productionEditor'))
    // if (!this.user || !Array.isArray(this.user.teams)) {
    //   return false
    // }
    return this.isTeamMember('productionEditor')
  }

  /**
   * Checks if userId is present, indicating an authenticated user
   *
   * @param {any} userId
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.userId
  }

  async canReadCollection() {
    if (!this.isAuthenticated()) {
      return false
    }

    this.user = await this.context.models.User.find(this.userId)

    const collection = await this.context.models.Collection.find(this.object.id)

    const permission =
      (await this.isAuthor(collection)) ||
      (await this.isAssignedCopyEditor(collection)) ||
      (await this.isAssignedProductionEditor(collection))

    return permission
  }

  async canListCollections() {
    if (!this.isAuthenticated()) {
      return false
    }
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

  async canListUsers() {
    return this.isAuthenticated()
  }

  async canReadUser() {
    if (!this.isAuthenticated()) {
      return false
    }

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
    return this.isAuthenticated()
  }

  async canReadTeam() {
    if (!this.isAuthenticated()) {
      return false
    }

    this.user = await this.context.models.User.find(this.userId)

    // logic here
    return true
  }
  async canCreateTeam() {
    this.user = await this.context.models.User.find(this.userId)
    // if (!this.isAuthenticated()) {
    //   return false
    // }

    return this.isProductionEditor()
  }
  async canViewTeams() {
    this.user = await this.context.models.User.find(this.userId)
    return this.isAdmin()
  }
  async canViewUsers() {
    this.user = await this.context.models.User.find(this.userId)
    return this.isAdmin()
  }

  /**
   * Checks if a user can create a collection.
   *
   * @returns {boolean}
   */
  async canCreateCollection() {
    this.user = await this.context.models.User.find(this.userId)
    if (!this.isAuthenticated) {
      return false
    }
    return this.isProductionEditor()
  }
}

module.exports = {
  before: async (userId, operation, object, context) => {
    const user = await context.models.User.find(userId)
    return user.admin
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

    // GET /api/users
    if (object && object.path === '/users') {
      return mode.canListUsers()
    }

    // // GET /api/fragments
    // if (object && object.path === '/fragments') {
    //   return mode.canListFragments()
    // }

    // // GET /api/teams
    if (object && object.path === '/teams') {
      return mode.canListTeams()
    }

    // // GET /api/fragment
    // if (object && object.type === 'fragment') {
    //   return mode.canReadFragment()
    // }

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
    console.log('user', userId)
    console.log('operation', operation)
    console.log('object', object)
    console.log('context', context)
    // POST /api/collections
    if (object && object.path === '/collections') {
      // console.log('hello')
      return mode.canCreateCollection()
    }

    // POST /api/users
    if (object && object.path === '/users') {
      return mode.canCreateUser()
    }

    // POST /api/fragments
    if (object && object.path === '/fragments') {
      return mode.canCreateFragment()
    }

    // POST /api/collections/:collectionId/fragments
    if (object && object.path === '/collections/:collectionId/fragments') {
      return mode.canCreateFragmentInACollection()
    }

    // POST /api/teams
    if (object && object.path === '/teams') {
      console.log('in here')
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
      return mode.canDeleteCollection()
    }

    // DELETE /api/fragments/:id
    if (object && object.type === 'fragments') {
      return mode.canDeleteFragment()
    }

    // DELETE /api/teams/:id
    if (object && object.type === 'teams') {
      return mode.canDeleteTeam()
    }

    return false
  },
  PRESENTATION: (userId, operation, object, context) => {
    const mode = new EditoriaMode(userId, operation, object, context)
    if (object && object.path === '/users') {
      return mode.canViewUsers()
    }
    if (object && object.path === '/teams') {
      return mode.canViewTeams()
    }
    return false
  },
}
