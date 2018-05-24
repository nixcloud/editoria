import config from 'config'
import { each, filter, forEach, isEmpty, union, isEqual } from 'lodash'
// TODO -- clean up this import
import Actions from 'pubsweet-client/src/actions'
import React from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AddBookModal from './AddBookModal'
import BookList from './BookList'
import DashboardHeader from './DashboardHeader'
import styles from './dashboard.local.scss'

export class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.createBook = this.createBook.bind(this)
    this.createTeamsForBook = this.createTeamsForBook.bind(this)
    this.editBook = this.editBook.bind(this)
    // this.findBooksWithNoTeams = this.findBooksWithNoTeams.bind(this)
    this.removeBook = this.removeBook.bind(this)
    this.removeTeamsForBook = this.removeTeamsForBook.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
    this.isProductionEditor = this.isProductionEditor.bind(this)

    this.state = {
      showModal: false,
    }
  }

  /*
    Get books and teams.
    Make sure all books have teams associated with them.
  */
  componentWillMount() {
    const { actions } = this.props
    const { getCollections, getTeams } = actions

    getCollections()
    getTeams()
    // .then(() => this.findBooksWithNoTeams())
  }
  // This is due to the fact that user sse are not available.
  // Refactor on pubsweet-server is needed
  componentWillReceiveProps(nextProps) {
    const { teams, books, user, actions } = this.props
    const { getCollections, getTeams, getUser } = actions

    if (
      nextProps.books['-1'] ||
      !isEqual(nextProps.teams, teams) ||
      !isEqual(nextProps.books, books)
    ) {
      getUser(user)
      getCollections()
      getTeams()
    }
  }

  /*
    Toggle showing 'add book' modal
  */
  toggleModal() {
    this.setState({
      showModal: !this.state.showModal,
    })
  }

  /*
    Create a new book with the given title.
    Once you have the new book's db id, make the teams for it as well.
  */
  createBook(newTitle) {
    const { createCollection } = this.props.actions
    const { user } = this.props

    const book = {
      title: newTitle || 'Untitled',
      productionEditor: this.isProductionEditor(user.id) ? [user] : [],
    }

    createCollection(book).then(res => {
      const createdBook = res.collection
      this.createTeamsForBook(createdBook)
    })
  }

  /*
    Edit a book's properties.
  */
  editBook(patch) {
    const { updateCollection } = this.props.actions
    updateCollection(patch)
  }

  /*
    Return an array of all the roles that the current user has
  */
  // getRoles() {
  // const { user } = this.props
  // console.log('teams', this.state)

  // let roles = []
  // if (user.admin) roles.push('admin')

  // function addRole(role) {
  //   roles = union(roles, [role])
  // }

  // forEach(user.teams, t => {
  //   switch (t.teamType.name) {
  //     case 'Production Editor':
  //       addRole('production-editor')
  //       break
  //     case 'Copy Editor':
  //       addRole('copy-editor')
  //       break
  //     case 'Author':
  //       addRole('author')
  //       break
  //     default:
  //       break
  //   }
  // })

  // return roles
  // }

  /*
    Remove the given book.
    Also remove all teams associated with it.
  */
  removeBook(book) {
    const { deleteCollection } = this.props.actions

    deleteCollection(book)
  }

  /*
    Find all books that have no teams associated with them.
    If one is found, make the teams for it.
    This will most likely only happen once:
      # The first time the app is run, on the collection created by
      # the command 'pubsweet setupdb'.
  */
  // TODO -- refactor so that less operations run most of the time
  // findBooksWithNoTeams() {
  //   const { books, teams } = this.props

  //   each(books, book => {
  //     const teamsForBook = filter(teams, t => t.object.id === book.id)

  //     if (isEmpty(teamsForBook)) {
  //       this.createTeamsForBook(book)
  //     }
  //   })
  // }

  isProductionEditor(userId) {
    const { teams, user } = this.props
    if (!user.admin) {
      const productionEditorTeams = filter(teams, {
        teamType: 'productionEditor',
      })

      const membership = productionEditorTeams.map(team =>
        team.members.includes(userId),
      )

      return membership.includes(true)
    }
    return false
  }

  /*
    Create the teams found in the config file for the given book.
    This should run either when a new book is created,
    or when a book with no teams associated with it is found.
  */
  createTeamsForBook(book) {
    const { createTeam, getCurrentUser } = this.props.actions
    const { user } = this.props

    const teamTypes = Object.keys(config.authsome.teams)

    for (let i = 0; i < teamTypes.length; i += 1) {
      const teamType = teamTypes[i]
      const members = []
      if (!user.admin) {
        if (
          this.isProductionEditor(user.id) &&
          teamType === 'productionEditor'
        ) {
          members.push(user.id)
        }
      }
      const newTeam = {
        members,
        name: config.authsome.teams[teamType].name,
        object: {
          id: book.id,
          type: 'collection',
        },
        teamType,
      }
      createTeam(newTeam).then(res => {
        getCurrentUser()
      })
    }
    // teamTypes.map(teamType => {
    //   const newTeam = {
    //     members: [],
    //     name: config.authsome.teams[teamType].name,
    //     object: {
    //       id: book.id,
    //       type: 'collection',
    //     },
    //     teamType,
    //   }
    //   createTeam(newTeam)
    // })
    // each(config.authsome.teams, teamType => {
    //   console.log('teamType', teamType)
    //   // TODO -- Review the idea that the name needs to be plural for some teams
    //   const name =
    //     teamType.name === 'Production Editor'
    //       ? teamType.name
    //       : `${teamType.name}s`

    //   const newTeam = {
    //     members: [],
    //     name,
    //     object: {
    //       id: book.id,
    //       type: 'collection',
    //     },
    //     teamType,
    //   }

    //   createTeam(newTeam)
    // })
  }

  /*
    Delete all teams associated with the given book.
    This should only run after a book is deleted.
  */
  removeTeamsForBook(book) {
    const { actions, teams } = this.props
    const { deleteTeam } = actions

    const teamsToDelete = filter(teams, team => team.object.id === book.id)

    each(teamsToDelete, team => {
      deleteTeam(team)
    })
  }

  render() {
    const { books } = this.props
    const { showModal } = this.state
    // if (teams.length === 0) return null
    // const roles = this.getRoles()

    const className = `${
      styles.bookList
    } bootstrap pubsweet-component pubsweet-component-scroll`

    return (
      <div className={className}>
        <div className="container col-lg-offset-2 col-lg-8">
          <DashboardHeader toggle={this.toggleModal} user={this.props.user} />

          <BookList
            books={books}
            container={this}
            edit={this.editBook}
            remove={this.removeBook}
          />
        </div>

        <AddBookModal
          container={this}
          create={this.createBook}
          show={showModal}
          toggle={this.toggleModal}
        />
      </div>
    )
  }
}

Dashboard.propTypes = {
  actions: PropTypes.objectOf(PropTypes.func).isRequired,
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string,
    }),
  ),
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
  }).isRequired,
}

Dashboard.defaultProps = {
  books: null,
  teams: null,
}

function mapStateToProps(state, { params }) {
  return {
    books: state.collections,
    teams: state.teams,
    user: state.currentUser.user,
  }
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(Actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)
