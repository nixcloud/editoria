import _ from 'lodash'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// TODO -- clean up this import
import Actions from 'pubsweet-client/src/actions'

import Division from './Division'
import FileUploader from './FileUploader/FileUploader'
import VivliostyleExporter from './ExportToVivliostyle/VivliostyleExporter'
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
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      outerContainer: {},
      showTeamManager: false,
      showModal: false,
      uploading: {}
    }
  }

  componentWillMount () {
    const { getCollections, getFragments, getTeams, getUsers } = this.props.actions

    getUsers()
      .then(() => getTeams())
      .then(() => getCollections())
      .then(() => {
        const { book } = this.props

        this.setProductionEditor()
        getFragments(book)
      })
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

    const productionEditorsTeam = _.find(
      teams,
      t => t.teamType.name === 'Production Editor' && t.object.id === book.id
    )

    if (!productionEditorsTeam) return

    const productionEditors = _.filter(users, u => _.includes(productionEditorsTeam.members, u.id))

    let patch

    if (_.isEmpty(productionEditors)) {
      // production editor is already set to null
      if (book.productionEditor === null) return

      patch = {
        id: book.id,
        rev: book.rev,
        productionEditor: null
      }

      return updateCollection(patch)
    }

    const currentEditor = book.productionEditor
    const foundEditor = productionEditors[0] || null

    if (currentEditor === foundEditor) return

    patch = {
      id: book.id,
      rev: book.rev,
      productionEditor: _.pick(foundEditor, ['id', 'username'])
    }

    updateCollection(patch)
  }

  toggleModal () {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  _toggleTeamManager () {
    this.setState({ showTeamManager: !this.state.showTeamManager })
  }

  _getRoles () {
    const { user, book } = this.props

    const teams = _.filter(user.teams, t => t.object.id === book.id)

    let roles = []
    if (user.admin) roles.push('admin')

    function addRole (role) {
      roles = _.union(roles, [role])
    }

    _.forEach(teams, (t) => {
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
    const pass = _.some(accepted, role => _.includes(userRoles, role))
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
    const { createFragment, deleteFragment, htmlToEpub, ink, updateFragment } = this.props.actions
    const { outerContainer } = this.state
    const roles = this._getRoles()

    const frontChapters = []
    const bodyChapters = []
    const backChapters = []

    _.forEach(chapters, (c) => {
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
        <span onClick={this._toggleTeamManager}>
          <div className={styles.teamManagerIcon} />
          <div className={styles.teamManagerBtn}>
            <a>team manager</a>
          </div>
        </span>
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
            ref='outerContainer'
          >
            <div className={styles.productionEditorContainer + ' row'}>
              <span>Production Editor: &nbsp; {productionEditor} </span>
              {teamManagerButton}
              <div className={styles.separator} />
            </div>

            <h1 className={styles.bookTitle + ' row'}>{this.props.book.title}</h1>
            <div className={styles.btnContainer + ' row'}>
              <div className={`${styles.lineUploading} `} />
              <div className={styles.btnContainerButtons}>
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
                <VivliostyleExporter
                  book={book}
                  htmlToEpub={htmlToEpub}
                  outerContainer={outerContainer}
                  showModal={this.state.showModal}
                  showModalToggle={this.toggleModal}
                />
              </div>
            </div>

            <Division
              add={createFragment}
              book={book}
              chapters={frontChapters}
              ink={ink}
              outerContainer={outerContainer}
              remove={deleteFragment}
              roles={roles}
              title='Frontmatter'
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
              title='Backmatter'
              type='back'
              update={updateFragment}
              uploadStatus={this.state.uploading}
            />
          </div>
        </div>

        {teamManagerModal}
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

function mapStateToProps (state, { match }) {
  const book = _.find(state.collections, c => c.id === match.params.id)

  const chapters = _.sortBy(
    _.filter(state.fragments, f => f.book === book.id && f.id && !f.deleted),
    'index'
  )

  // console.log(chapters)

  const teams = state.teams
  const users = state.users.users
  const user = state.currentUser.user

  const error = state.error

  return {
    book: book || {},
    chapters,
    teams,
    users,
    user,
    // userRoles: state.auth.roles,
    errorMessage: error
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookBuilder)
