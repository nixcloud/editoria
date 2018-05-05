const collections = [
  {
    id: 'collection1',
    type: 'collection',
    title: 'Collection One',
    fragments: [
      'fragment0',
      'fragment1',
      'fragment2',
      'fragment3',
      'fragment4',
    ],
    owners: ['user1', 'user2', 'user3'],
  },
  {
    id: 'collection2',
    title: 'Collection Two',
    type: 'collection',
    fragments: [],
  },
]

const fragments = [
  {
    id: 'fragment0',
    type: 'fragment',
    book: 'collection1',
    title: 'Fragment Title',
    index: 0,
    kind: 'component',
    division: 'front',
    subCategory: 'component',
    progress: {
      clean: 0,
      edit: 0,
      review: 0,
      style: 0,
    },
    alignment: {
      left: false,
      right: false,
    },
  },
  {
    id: 'fragment1',
    type: 'fragment',
    book: 'collection1',
    title: 'Fragment Title',
    index: 0,
    kind: 'component',
    division: 'body',
    subCategory: 'chapter',
    progress: {
      clean: 0,
      edit: 0,
      review: 0,
      style: 0,
    },
    alignment: {
      left: false,
      right: false,
    },
  },
  {
    id: 'fragment2',
    type: 'fragment',
    book: 'collection1',
    title: 'Fragment Title',
    index: 1,
    kind: 'component',
    number: 1,
    division: 'body',
    subCategory: 'chapter',
    progress: {
      clean: 0,
      edit: 1,
      review: 1,
      style: 0,
    },
    alignment: {
      left: false,
      right: false,
    },
  },
  {
    id: 'fragment3',
    type: 'fragment',
    title: 'Fragment Title',
    book: 'collection1',
    index: 2,
    kind: 'component',
    division: 'body',
    subCategory: 'part',
    progress: {
      clean: 0,
      edit: 0,
      review: 0,
      style: 0,
    },
    alignment: {
      left: false,
      right: false,
    },
  },
  {
    id: 'fragment4',
    type: 'fragment',
    book: 'collection1',
    title: 'Fragment Title',
    index: 0,
    kind: 'component',
    division: 'back',
    subCategory: 'component',
    progress: {
      clean: 0,
      edit: 0,
      review: 0,
      style: 0,
    },
    alignment: {
      left: false,
      right: false,
    },
  },
]

const teams = [
  {
    id: 'teamCollection1Prod',
    teamType: 'productionEditor',
    object: {
      id: 'collection1',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection1Cp',
    teamType: 'copyEditor',
    object: {
      id: 'collection1',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection1Auth',
    teamType: 'author',
    object: {
      id: 'collection1',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection2Prod',
    teamType: 'productionEditor',
    object: {
      id: 'collection2',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection2Cp',
    teamType: 'copyEditor',
    object: {
      id: 'collection2',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection2Auth',
    teamType: 'author',
    object: {
      id: 'collection2',
      type: 'collection',
    },
    type: 'team',
  },
]

const users = [
  {
    id: 'user',
    username: 'generic',
    teams: [],
    type: 'user',
  },
  {
    id: 'userWrongTeam',
    username: 'generic',
    teams: ['worngTeam'],
    type: 'user',
  },
  {
    id: 'user1',
    username: 'alex',
    teams: ['teamCollection1Prod', 'teamCollection2Prod'],
    type: 'user',
  },
  {
    id: 'user2',
    username: 'chris',
    teams: ['teamCollection1Cp', 'teamCollection2Cp'],
    type: 'user',
  },
  {
    id: 'user3',
    username: 'john',
    teams: ['teamCollection1Auth', 'teamCollection2Auth'],
    type: 'user',
  },
  {
    id: 'adminId',
    username: 'admin',
    admin: true,
    type: 'user',
  },
]

const updatedCollectionTitle = {
  current: collections[0],
  update: { id: collections[0].id, title: 'New Collection One' },
}

const updateFragmentSource = {
  current: fragments[0],
  update: {
    id: fragments[0].id,
    source: '<blog><title>Updated</title></blog>',
  },
}

const updateFragmentOrder = {
  current: fragments[0],
  update: {
    id: fragments[0].id,
    number: 2,
    index: 2,
  },
}

const updateFragmentPage = {
  current: fragments[0],
  update: {
    id: fragments[0].id,
    alignment: {
      left: true,
      right: false,
    },
  },
}

const updateFragmentProgressEdit = {
  current: fragments[0],
  update: {
    id: fragments[0].id,
    progress: {
      clean: 0,
      edit: 2,
      review: 0,
      style: 0,
    },
  },
}
const updateFragmentProgressReview = {
  current: fragments[0],
  update: {
    id: fragments[0].id,
    progress: {
      clean: 0,
      edit: 0,
      review: 2,
      style: 0,
    },
  },
}

const updateFragmentProgressEditCP = {
  current: fragments[2],
  update: {
    id: fragments[2].id,
    progress: {
      clean: 0,
      edit: 2,
      review: 0,
      style: 0,
    },
  },
}
const updateFragmentLock = {
  current: fragments[2],
  update: {
    lock: {
      editor: { username: 'copyEditor' },
    },
  },
}
const updateFragmentProgressReviewAU = {
  current: fragments[2],
  update: {
    id: fragments[2].id,
    progress: {
      clean: 0,
      edit: 0,
      review: 2,
      style: 0,
    },
  },
}
const updateFragmentMultipleProperties = {
  current: fragments[2],
  update: {
    id: fragments[2].id,
    progress: {
      clean: 0,
      edit: 0,
      review: 2,
      style: 0,
    },
    source: 'hello',
  },
}
const updateTeam = {
  current: teams[0],
  update: {
    id: teams[0].id,
    teamType: 'someTeam',
  },
}
module.exports = {
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
}
