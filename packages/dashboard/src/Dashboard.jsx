import { each, filter, forEach, isEmpty, union } from 'lodash'
// TODO -- clean up this import
import Actions from 'pubsweet-client/src/actions'
import React from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import AddBookModal from './AddBookModal'
import BookList from './BookList'
import DashboardHeader from './DashboardHeader'
// import { teamTypes } from '../utils/config'
import styles from './dashboard.local.scss'

export class Dashboard extends React.Component {
  constructor (props) {
    super(props)

    this.createBook = this.createBook.bind(this)
    this.createTeamsForBook = this.createTeamsForBook.bind(this)
    this.editBook = this.editBook.bind(this)
    this.findBooksWithNoTeams = this.findBooksWithNoTeams.bind(this)
    this.removeBook = this.removeBook.bind(this)
    this.removeTeamsForBook = this.removeTeamsForBook.bind(this)
    this.toggleModal = this.toggleModal.bind(this)

    this.state = {
      showModal: false
    }
  }

  /*
    Get books and teams.
    Make sure all books have teams associated with them.
  */
  componentWillMount () {
    const { actions } = this.props
    const { getCollections, getTeams } = actions

    getCollections().then(
      () => getTeams()
    ).then(
      () => this.findBooksWithNoTeams()
    )
  }

  /*
    Toggle showing 'add book' modal
  */
  toggleModal () {
    this.setState({
      showModal: !this.state.showModal
    })
  }

  /*
    Create a new book with the given title.
    Once you have the new book's db id, make the teams for it as well.
  */
  createBook (newTitle) {
    const { createCollection } = this.props.actions

    const book = {
      title: newTitle || 'Untitled'
    }

    createCollection(book).then(res => {
      const createdBook = res.collection
      this.createTeamsForBook(createdBook)
    })
  }

  /*
    Edit a book's properties.
  */
  editBook (patch) {
    const { updateCollection } = this.props.actions
    updateCollection(patch)
  }

  /*
    Return an array of all the roles that the current user has
  */
  getRoles () {
    const { user } = this.props

    let roles = []
    if (user.admin) roles.push('admin')

    function addRole (role) {
      roles = union(roles, [role])
    }

    forEach(user.teams, (t) => {
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
        default:
          break
      }
    })

    return roles
  }

  /*
    Remove the given book.
    Also remove all teams associated with it.
  */
  removeBook (book) {
    const { deleteCollection } = this.props.actions

    deleteCollection(book).then(res => {
      this.removeTeamsForBook(book)
    })
  }

  /*
    Find all books that have no teams associated with them.
    If one is found, make the teams for it.
    This will most likely only happen once:
      # The first time the app is run, on the collection created by
      # the command 'pubsweet setupdb'.
  */
  // TODO -- refactor so that less operations run most of the time
  findBooksWithNoTeams () {
    const { books, teams } = this.props

    each(books, book => {
      const teamsForBook = filter(teams, t => {
        return t.object.id === book.id
      })

      if (isEmpty(teamsForBook)) {
        this.createTeamsForBook(book)
      }
    })
  }

  /*
    Create the teams found in the config file for the given book.
    This should run either when a new book is created,
    or when a book with no teams associated with it is found.
  */
  createTeamsForBook (book) {
    const { createTeam } = this.props.actions

    each(CONFIG.dashboard.teamTypes, (teamType) => {
      // TODO -- Review the idea that the name needs to be plural for some teams
      const name = (teamType.name === 'Production Editor')
      ? teamType.name
      : teamType.name + 's'

      const newTeam = {
        members: [],
        name: name,
        object: {
          id: book.id,
          type: 'collection'
        },
        teamType: teamType
      }

      createTeam(newTeam)
    })
  }

  /*
    Delete all teams associated with the given book.
    This should only run after a book is deleted.
  */
  removeTeamsForBook (book) {
    const { actions, teams } = this.props
    const { deleteTeam } = actions

    const teamsToDelete = filter(teams, team => {
      return team.object.id === book.id
    })

    each(teamsToDelete, team => {
      deleteTeam(team)
    })
  }

  render () {
    const { books } = this.props
    const { showModal } = this.state

    const roles = this.getRoles()

    const className = styles.bookList +
      ' bootstrap pubsweet-component pubsweet-component-scroll'

    return (
      <div className={className}>
        <div className='container col-lg-offset-2 col-lg-8'>

          <DashboardHeader
            roles={roles}
            toggle={this.toggleModal}
          />

          <BookList
            books={books}
            container={this}
            edit={this.editBook}
            remove={this.removeBook}
            roles={roles}
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
  actions: React.PropTypes.object.isRequired,
  books: React.PropTypes.arrayOf(React.PropTypes.object),  // TODO -- ??
  teams: React.PropTypes.arrayOf(React.PropTypes.object),
  user: React.PropTypes.object.isRequired
}

function mapStateToProps (state, { params }) {
  return {
    books: state.collections,
    teams: state.teams,
    user: state.currentUser.user
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
)(Dashboard)