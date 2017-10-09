import sinon from 'sinon'
import 'sinon-as-promised'

import { teams, users } from './dataMock'

const actions = {
  createFragment: sinon.spy(),
  deleteFragment: sinon.spy(),
  getTeams: sinon.stub().resolves(teams),
  getUsers: sinon.stub().resolves(users),
  ink: sinon.spy(),
  updateFragment: sinon.spy()
}

module.exports = { actions }
