/** The base class for Editoria's Authsome mode. */
class EditoriaMode {
  /**
   * Creates a new instance of XpubCollabraMode
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
    // console.log('isteam')
    if (!this.user || !Array.isArray(this.user.teams)) {
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
      membershipCondition = team => team.teamType === teamType && !team.object
    }

    const memberships = await Promise.all(
      this.user.teams.map(async teamId => {
        const team = await this.context.models.Team.find(teamId)
        return membershipCondition(team)
      }),
    )

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
  isAuthor() {
    if (!this.object || !this.object.owners || !this.user) {
      return false
    }
    return this.object.owners.includes(this.user.id)
  }

  /**
   * Checks if the user is an author, as represented with the owners
   * relationship
   *
   * @returns {boolean}
   */
  isAdmin() {
    return this.user && this.user.admin
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
  // isProductionEditor() {
  //   return this.isTeamMember('productionEditor')
  // }

  /**
   * Checks if userId is present, indicating an authenticated user
   *
   * @param {any} userId
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!this.userId
  }
}

/** This class is used to handle authorization requirements for REST endpoints. */
class RESTMode extends EditoriaMode {
  /**
   * Determine if the current operation is a listing of the collections
   *
   * @returns {boolean}
   * @memberof RESTMode
   */
  isListingCollections() {
    if (
      this.operation === 'read' &&
      this.object &&
      this.object.path === '/collections'
    ) {
      return true
    }
    return false
  }

  /**
   * Determine if the current operation is reading a collection
   *
   * @returns { boolean }
   * @memberof RESTMode
   */
  isGettingCollection() {
    if (
      this.operation === 'read' &&
      this.object &&
      this.object.type === '/books'
    ) {
      return true
    }
    return false
  }

  /**
   * Returns true if the current operation is a create on collections
   *
   * @returns {boolean}
   */
  isCreatingCollections() {
    return (
      this.operation === 'create' &&
      this.object &&
      this.object.path === '/collections'
    )
  }

  isGettingGlobalUsers() {
    if (
      this.operation === 'read' &&
      this.object &&
      this.object.path === '/users'
    ) {
      return true
    }
    return false
  }

  isGettingGlobalTeams() {
    if (
      this.operation === 'read' &&
      this.object &&
      this.object.path === '/teams'
    ) {
      return true
    }
    return false
  }

  /**
   * An async functions that's the entry point for determining
   * authorization results. Returns true (if allowed), false (if not allowed),
   * and { filter: function(filterable) } if partially allowed
   *
   * @returns {any} Returns true, false or { filter: fn }
   * @memberof RESTMode
   */
  async determine() {
    if (!this.isAuthenticated()) {
      return this.unauthenticatedUser(this.operation)
    }

    this.user = await this.context.models.User.find(this.userId)
    console.log('user', this.user)

    // Admins can do anything
    if (this.isAdmin()) {
      console.log('is admin')
      return true
    }
    // Navbar Rules
    if (this.isGettingGlobalTeams() || this.isGettingGlobalUsers()) {
      return this.isAdmin()
    }

    // Users can create collections
    if (this.isCreatingCollections()) {
      return this.isAdmin()
    }

    if (this.isListingCollections()) {
      const test = {
        filter: async collections => {
          const filteredCollections = await Promise.all(
            collections.map(async collection => {
              const condition =
                this.isAuthor(collection) ||
                ((await this.isAssignedCopyEditor(collection)) ||
                  (await this.isAssignedProductionEditor(collection)))
              return condition ? collection : undefined // eslint-disable-line
            }),
          )

          return filteredCollections.filter(collection => collection)
        },
      }
      return test
    }

    return false
  }
}

module.exports = {
  GET: (userId, operation, object, context) => {
    const mode = new RESTMode(userId, operation, object, context)
    return mode.determine()
  },
  POST: (userId, operation, object, context) => {
    const mode = new RESTMode(userId, operation, object, context)
    return mode.determine()
  },
  PATCH: (userId, operation, object, context) => {
    const mode = new RESTMode(userId, operation, object, context)
    return mode.determine()
  },
  DELETE: (userId, operation, object, context) => {
    const mode = new RESTMode(userId, operation, object, context)
    return mode.determine()
  },
}
