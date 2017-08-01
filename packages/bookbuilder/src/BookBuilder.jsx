import _ from 'lodash'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// TODO -- clean up this import
import Actions from 'pubsweet-client/src/actions'

import Division from './Division'
import FileUploader from './FileUploader/FileUploader'
import TeamManagerModal from './TeamManager/TeamManagerModal'

import styles from './styles/bookBuilder.local.scss'

// TODO -- this doesn't work if imported in the css files. why?
import './styles/fontAwesome.scss'

export class BookBuilder extends React.Component {
  constructor (props) {
    super(props)

    this._toggleTeamManager = this._toggleTeamManager.bind(this)

    this._getRoles = this._getRoles.bind(this)
    this._isProductionEditor = this._isProductionEditor.bind(this)
    this.setProductionEditor = this.setProductionEditor.bind(this)
    this.updateUploadStatus = this.updateUploadStatus.bind(this)

    this.state = {
      outerContainer: {},
      showTeamManager: false,
      uploading: {}
    }
  }

  componentWillMount () {
    const {
      getCollections,
      getFragments,
      getTeams,
      getUsers
    } = this.props.actions

    getUsers().then(
      () => getTeams()
    ).then(
      () => {
        return getCollections()
      }
    ).then(
      () => {
        const { book } = this.props

        this.setProductionEditor()
        getFragments(book)
      }
    )
  }

  componentDidMount () {
    // I'm using the ref inside the render function it was created in
    // So it won't be available until didMount
    // Pass it to the state and use it safely (no undefined scenarios)
    this.setState({ outerContainer: this.refs.outerContainer })
  }

  setProductionEditor () {
    const { actions, book, teams, users } = this.props
    const { updateCollection } = actions

    const productionEditorsTeam = _.find(teams, function (t) {
      return t.teamType.name === 'Production Editor' && t.object.id === book.id
    })

    if (!productionEditorsTeam) return

    const productionEditors = _.filter(users, function (u) {
      return _.includes(productionEditorsTeam.members, u.id)
    })

    let patch

    if (_.isEmpty(productionEditors)) {
      // production editor is already set to null
      if (book.productionEditor === null) return

      patch = {
        id: book.id,
        productionEditor: null
      }

      return updateCollection(patch)
    }

    const currentEditor = book.productionEditor
    const foundEditor = productionEditors[0] || null

    if (currentEditor === foundEditor) return

    patch = {
      id: book.id,
      productionEditor: _.pick(foundEditor, ['id', 'username'])
    }

    updateCollection(patch)
  }

  _toggleTeamManager () {
    this.setState({ showTeamManager: !this.state.showTeamManager })
  }

  _getRoles () {
    const { user, book } = this.props

    const teams = _.filter(user.teams, function (t) {
      return t.object.id === book.id
    })

    let roles = []
    if (user.admin) roles.push('admin')

    function addRole (role) {
      roles = _.union(roles, [role])
    }

    _.forEach(teams, function (t) {
      switch (t.teamType.name) {
        case 'Production Editor':
          addRole('production-editor')
          break
        case 'Copy Editor':
          addRole('copy-editor')
          break
        case 'Author':
          addRole('author')
          break
      }
    })

    return roles
  }

  _isProductionEditor () {
    const userRoles = this._getRoles()
    const accepted = ['production-editor', 'admin']
    const pass = _.some(accepted, (role) => _.includes(userRoles, role))
    return pass
  }

  renderTeamManagerModal () {
    if (!this._isProductionEditor()) return null

    const { outerContainer, showTeamManager } = this.state

    if (!showTeamManager) return null
    if (_.isEmpty(outerContainer)) return null

    const { actions, teams, users } = this.props
    const { updateTeam } = actions

    return (
      <TeamManagerModal
        container={outerContainer}
        show={showTeamManager}
        teams={teams}
        toggle={this._toggleTeamManager}
        updateTeam={updateTeam}
        users={users}
      />
    )
  }

  updateUploadStatus (status) {
    this.setState({ uploading: status })
  }

  render () {
    const { book, chapters } = this.props
    const { createFragment, deleteFragment, ink, updateFragment } = this.props.actions
    const { outerContainer } = this.state
    const roles = this._getRoles()

    let frontChapters = []
    let bodyChapters = []
    let backChapters = []

    _.forEach(chapters, function (c) {
      switch (c.division) {
        case 'front':
          frontChapters.push(c)
          break
        case 'body':
          bodyChapters.push(c)
          break
        case 'back':
          backChapters.push(c)
          break
      }
    })

    const isProductionEditor = this._isProductionEditor()
    let teamManagerButton = ''
    if (isProductionEditor) {
      teamManagerButton = (
        <div
          className={styles.teamManagerBtn}
          onClick={this._toggleTeamManager}
        >
          <a>team manager</a>
        </div>
      )
    }

    const productionEditor = _.get(book, 'productionEditor.username') || 'unassigned'
    const teamManagerModal = this.renderTeamManagerModal()

    // console.log('render bb')

    return (
      <div className='bootstrap modal pubsweet-component pubsweet-component-scroll'>
        <div className={styles.bookBuilder}>
          <div
            className='col-lg-offset-2 col-lg-8 col-md-8 col-sm-12 col-xs-12'
            ref='outerContainer'>

            <h1>{this.props.book.title}</h1>

            <div className={styles.productionEditorContainer}>
              <span>Production Editor: &nbsp; { productionEditor } </span>
              <FileUploader
                backChapters={backChapters}
                bodyChapters={bodyChapters}
                book={book}
                convert={ink}
                create={createFragment}
                frontChapters={frontChapters}
                update={updateFragment}
                updateUploadStatus={this.updateUploadStatus}
              />
              {teamManagerButton}
              <div className={styles.separator} />
            </div>

            <Division
              add={createFragment}
              book={book}
              chapters={frontChapters}
              ink={ink}
              outerContainer={outerContainer}
              remove={deleteFragment}
              roles={roles}
              title='Front Matter'
              type='front'
              update={updateFragment}
              uploadStatus={this.state.uploading}
            />

            <div className={styles.sectionDivider} />

            <Division
              add={createFragment}
              book={book}
              chapters={bodyChapters}
              ink={ink}
              outerContainer={outerContainer}
              remove={deleteFragment}
              roles={roles}
              title='Body'
              type='body'
              update={updateFragment}
              uploadStatus={this.state.uploading}
            />

            <div className={styles.sectionDivider} />

            <Division
              add={createFragment}
              book={book}
              chapters={backChapters}
              ink={ink}
              outerContainer={outerContainer}
              remove={deleteFragment}
              roles={roles}
              title='Back Matter'
              type='back'
              update={updateFragment}
              uploadStatus={this.state.uploading}
            />

          </div>
        </div>

        { teamManagerModal }
      </div>
    )
  }
}

BookBuilder.propTypes = {
  actions: React.PropTypes.object.isRequired,
  book: React.PropTypes.object.isRequired,
  chapters: React.PropTypes.array.isRequired,
  // error: React.PropTypes.string,
  teams: React.PropTypes.array,
  users: React.PropTypes.array,
  user: React.PropTypes.object
  // userRoles: React.PropTypes.array,
}

function mapStateToProps (state, ownProps) {
  let book = _.find(state.collections, function (c) {
    return c.id === ownProps.params.id
  })

  // console.log(state.fragments)

  let chapters = _.sortBy(_.filter(state.fragments, function (f) {
    return f.book === book.id && f.id && !f.deleted
  }), 'index')

  // console.log(chapters)

  let teams = state.teams
  let users = state.users.users
  let user = state.currentUser.user

  let error = state.error

  return {
    book: book || {},
    chapters: chapters,
    teams: teams,
    users: users,
    user: user,
    // userRoles: state.auth.roles,
    errorMessage: error
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BookBuilder)
