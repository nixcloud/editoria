import _ from 'lodash'
import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import Authorize from 'pubsweet-client/src/helpers/Authorize'
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
  constructor(props) {
    super(props)

    this.toggleTeamManager = this.toggleTeamManager.bind(this)

    // this.getRoles = this.getRoles.bind(this)
    // this.isProductionEditor = this.isProductionEditor.bind(this)
    // this.setProductionEditor = this.setProductionEditor.bind(this)
    this.updateUploadStatus = this.updateUploadStatus.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.renderDivison = this.renderDivison.bind(this)

    this.state = {
      outerContainer: {},
      showModal: false,
      showTeamManager: false,
      uploading: {},
    }
  }

  componentWillMount() {
    const {
      getCollections,
      getFragments,
      getTeams,
      getUsers,
    } = this.props.actions

    getUsers()
      .then(() => getTeams())
      .then(() => getCollections())
      .then(() => {
        const { book } = this.props

        // this.setProductionEditor()
        getFragments(book)
      })
  }

  componentDidMount() {
    // I'm using the ref inside the render function it was created in
    // So it won't be available until didMount
    // Pass it to the state and use it safely (no undefined scenarios)
    this.setState({ outerContainer: this.refs.outerContainer })
  }

  // setProductionEditor() {
  //   const { actions, book, teams, users } = this.props
  //   const { updateCollection } = actions

  //   const productionEditorsTeam = _.find(
  //     teams,
  //     t => t.teamType.name === 'Production Editor' && t.object.id === book.id,
  //   )

  //   if (!productionEditorsTeam) return

  //   const productionEditors = _.filter(users, u =>
  //     _.includes(productionEditorsTeam.members, u.id),
  //   )

  //   let patch

  //   if (_.isEmpty(productionEditors)) {
  //     // production editor is already set to null
  //     if (book.productionEditor === null) return

  //     patch = {
  //       id: book.id,
  //       productionEditor: null,
  //     }

  //     return updateCollection(patch)
  //   }

  //   const currentEditor = book.productionEditor
  //   const foundEditor = productionEditors[0] || null

  //   if (currentEditor === foundEditor) return

  //   patch = {
  //     id: book.id,
  //     productionEditor: _.pick(foundEditor, ['id', 'username']),
  //   }

  //   updateCollection(patch)
  // }

  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  toggleTeamManager() {
    this.setState({ showTeamManager: !this.state.showTeamManager })
  }

  // getRoles() {
  //   const { user, book } = this.props

  //   const teams = _.filter(user.teams, t => t.object.id === book.id)

  //   let roles = []
  //   if (user.admin) roles.push('admin')

  //   function addRole(role) {
  //     roles = _.union(roles, [role])
  //   }

  //   _.forEach(teams, t => {
  //     switch (t.teamType.name) {
  //       case 'Production Editor':
  //         addRole('production-editor')
  //         break
  //       case 'Copy Editor':
  //         addRole('copy-editor')
  //         break
  //       case 'Author':
  //         addRole('author')
  //         break
  //       default:
  //         break
  //     }
  //   })

  //   return roles
  // }

  // isProductionEditor() {
  //   const userRoles = this.getRoles()
  //   const accepted = ['production-editor', 'admin']
  //   const pass = _.some(accepted, role => _.includes(userRoles, role))
  //   return pass
  // }

  updateUploadStatus(status) {
    this.setState({ uploading: status })
  }

  renderTeamManagerModal() {
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
        toggle={this.toggleTeamManager}
        updateTeam={updateTeam}
        users={users}
      />
    )
  }

  renderDivison(reorderingAllowed, chapters, title, type) {
    const { book, user } = this.props
    const {
      createFragment,
      deleteFragment,
      ink,
      updateFragment,
    } = this.props.actions
    const { outerContainer, uploading } = this.state
    return (
      <Division
        add={createFragment}
        book={book}
        chapters={chapters}
        ink={ink}
        outerContainer={outerContainer}
        remove={deleteFragment}
        reorderingAllowed={reorderingAllowed}
        title={title}
        type={type}
        update={updateFragment}
        uploadStatus={uploading}
        user={user}
      />
    )
  }

  render() {
    const { book, chapters } = this.props
    const {
      createFragment,
      htmlToEpub,
      ink,
      updateFragment,
    } = this.props.actions
    const { outerContainer } = this.state
    // const roles = this.getRoles()

    const frontChapters = []
    const bodyChapters = []
    const backChapters = []

    _.forEach(chapters, c => {
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
        default:
          break
      }
    })
    const teamManagerModal = this.renderTeamManagerModal()

    return (
      <div className="bootstrap modal pubsweet-component pubsweet-component-scroll">
        <div className={styles.bookBuilder}>
          <div
            className="col-lg-offset-2 col-lg-8 col-md-8 col-sm-12 col-xs-12"
            ref="outerContainer"
          >
            <div className={`${styles.productionEditorContainer} row`}>
              <span>
                Production Editor: &nbsp;
                {book.productionEditor
                  ? book.productionEditor.username
                  : 'Unassigned'}
              </span>
              <Authorize object={book} operation="can view teamManager">
                <span onClick={this.toggleTeamManager}>
                  <div className={styles.teamManagerIcon} />
                  <div className={styles.teamManagerBtn}>
                    <a>team manager</a>
                  </div>
                </span>
              </Authorize>
              <div className={styles.separator} />
            </div>
            <h1 className={`${styles.bookTitle} row`}>
              {this.props.book.title}
            </h1>
            <div className={`${styles.btnContainer} row`}>
              <div className={`${styles.lineUploading} `} />
              <div className={styles.btnContainerButtons}>
                <Authorize
                  object={book}
                  operation="can view multipleFilesUpload"
                >
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
                </Authorize>
                <VivliostyleExporter
                  book={book}
                  htmlToEpub={htmlToEpub}
                  outerContainer={outerContainer}
                  showModal={this.state.showModal}
                  showModalToggle={this.toggleModal}
                />
              </div>
            </div>
            <Authorize
              object={book}
              operation="can reorder bookComponents"
              unauthorized={this.renderDivison(
                false,
                frontChapters,
                'Frontmatter',
                'front',
              )}
            >
              {this.renderDivison(true, frontChapters, 'Frontmatter', 'front')}
            </Authorize>
            <div className={styles.sectionDivider} />
            <Authorize
              object={book}
              operation="can reorder bookComponents"
              unauthorized={this.renderDivison(
                false,
                bodyChapters,
                'Body',
                'body',
              )}
            >
              {this.renderDivison(true, bodyChapters, 'Body', 'body')}
            </Authorize>

            <div className={styles.sectionDivider} />

            <Authorize
              object={book}
              operation="can reorder bookComponents"
              unauthorized={this.renderDivison(
                false,
                backChapters,
                'Backmatter',
                'back',
              )}
            >
              {this.renderDivison(true, backChapters, 'Backmatter', 'back')}
            </Authorize>
          </div>
        </div>
        <Authorize object={book} operation="can view teamManager">
          {teamManagerModal}
        </Authorize>
      </div>
    )
  }
}

BookBuilder.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  book: PropTypes.shape({
    id: PropTypes.string,
    rev: PropTypes.string,
    title: PropTypes.string,
  }).isRequired,
  chapters: PropTypes.arrayOf(
    PropTypes.shape({
      alignment: PropTypes.objectOf(PropTypes.bool),
      author: PropTypes.string,
      book: PropTypes.string,
      division: PropTypes.string,
      id: PropTypes.string,
      index: PropTypes.number,
      kind: PropTypes.string,
      lock: PropTypes.shape({
        editor: PropTypes.shape({
          username: PropTypes.string,
        }),
        timestamp: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
        ]),
      }),
      number: PropTypes.number,
      owners: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          username: PropTypes.string,
        }),
      ),
      progress: PropTypes.objectOf(PropTypes.number),
      rev: PropTypes.string,
      source: PropTypes.string,
      status: PropTypes.string,
      subCategory: PropTypes.string,
      title: PropTypes.string,
      trackChanges: PropTypes.bool,
      type: PropTypes.string,
    }),
  ).isRequired,
  // error: React.PropTypes.string,
  teams: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      name: PropTypes.string,
      type: PropTypes.string,
      rev: PropTypes.string,
      teamType: PropTypes.shape({
        name: PropTypes.string,
        permissions: PropTypes.arrayOf(PropTypes.string),
      }),
      members: PropTypes.arrayOf(PropTypes.string),
      object: PropTypes.shape({
        id: PropTypes.string,
        type: PropTypes.string,
      }),
    }),
  ),
  user: PropTypes.shape({
    admin: PropTypes.bool,
    email: PropTypes.string,
    id: PropTypes.string,
    rev: PropTypes.string,
    type: PropTypes.string,
    username: PropTypes.string,
  }),
  users: PropTypes.arrayOf(
    PropTypes.shape({
      admin: PropTypes.bool,
      email: PropTypes.string,
      id: PropTypes.string,
      rev: PropTypes.string,
      type: PropTypes.string,
      username: PropTypes.string,
    }),
  ),
  // userRoles: React.PropTypes.array,
}

BookBuilder.defaultProps = {
  teams: null,
  user: null,
  users: null,
}

function mapStateToProps(state, { match }) {
  const book = _.find(state.collections, c => c.id === match.params.id)

  const chapters = _.sortBy(
    _.filter(state.fragments, f => f.book === book.id && f.id && !f.deleted),
    'index',
  )

  const { error, teams, users, currentUser: user } = state

  return {
    book: book || {},
    chapters,
    errorMessage: error,
    teams,
    user: user.user,
    users: users.users,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BookBuilder)
