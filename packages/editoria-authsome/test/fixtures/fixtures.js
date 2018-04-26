const collections = [
  {
    id: 'collection1',
    type: 'collection',
    fragments: ['fragment1', 'fragment2', 'fragment3', 'fragment4'],
  },
  {
    id: 'collection2',
    type: 'collection',
  },
  {
    id: 'collection3',
    type: 'collection',
  },
]

const fragments = [
  {
    id: 'fragment1',
    type: 'fragment',
    book: 'collection1',
    index: 0,
    kind: 'component',
    division: 'front',
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
    id: 'fragment3',
    type: 'fragment',
    book: 'collection1',
    index: 0,
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
  {
    id: 'teamCollection3Prod',
    teamType: 'productionEditor',
    object: {
      id: 'collection3',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection3Cp',
    teamType: 'copyEditor',
    object: {
      id: 'collection3',
      type: 'collection',
    },
    type: 'team',
  },
  {
    id: 'teamCollection3Auth',
    teamType: 'author',
    object: {
      id: 'collection3',
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
    id: 'user1',
    username: 'alex',
    teams: ['teamCollection1Prod', 'teamCollection3Prod'],
    type: 'user',
  },
  {
    id: 'user2',
    username: 'chris',
    teams: ['teamCollection1Cp', 'teamCollection2Cp', 'teamCollection3Cp'],
    type: 'user',
  },
  {
    id: 'user3',
    username: 'john',
    teams: [
      'teamCollection1Auth',
      'teamCollection2Auth',
      'teamCollection3Auth',
    ],
    type: 'user',
  },
  {
    id: 'adminId',
    username: 'admin',
    admin: true,
    type: 'user',
  },
]

const collection1 = {
  type: 'collection',
  title: 'Collection1',
}

const productionEditorTeam = {
  teamType: 'productionEditor',
  object: collection1,
  type: 'team',
}

const user = {
  type: 'user',
  username: 'testuser',
  email: 'test@example.com',
  password: 'test',
}

const updatedUser = {
  username: 'changeduser',
  email: 'changed@email.com',
  password: 'changed',
}

const otherUser = {
  type: 'user',
  username: 'anotheruser',
  email: 'another@com.nz',
  password: 'rubgy',
}

const adminUser = {
  type: 'user',
  username: 'admin',
  email: 'admin@admins.example.org',
  password: 'admin',
  admin: true,
}

const updatedCollection = {
  title: 'Update Blogger posts',
}

const fragment = {
  type: 'fragment',
  title: 'Just your regular fragment',
  source: '<blog></blog>',
  presentation: '<p></p>',
}

const updatedFragment = {
  type: 'fragment',
  source: '<blog><title>Updated</title></blog>',
}

module.exports = {
  collections,
  collection1,
  fragments,
  updatedCollection,
  users,
  productionEditorTeam,
  fragment,
  updatedFragment,
  user,
  updatedUser,
  otherUser,
  adminUser,
  teams,
}
