const book = {
  id: '0',
  title: 'Test Book'
}

const chapters = [
  {
    alignment: {
      left: false,
      right: false
    },
    author: '',
    book: book.id,
    comments: {},
    division: 'front',
    index: 0,
    kind: 'chapter',
    lock: null,
    progress: {
      style: 0,
      edit: 0,
      review: 0,
      clean: 0
    },
    source: '',
    status: 'unpublished',
    subCategory: 'component',
    title: 'Preface',
    trackChanges: false
  },
  {
    alignment: {
      left: false,
      right: false
    },
    author: '',
    book: book.id,
    comments: {},
    division: 'front',
    index: 1,
    kind: 'chapter',
    lock: null,
    progress: {
      style: 0,
      edit: 0,
      review: 0,
      clean: 0
    },
    source: '',
    status: 'unpublished',
    subCategory: 'component',
    title: 'Introduction',
    trackChanges: false
  },
  {
    alignment: {
      left: false,
      right: false
    },
    author: '',
    book: book.id,
    comments: {},
    division: 'body',
    index: 0,
    kind: 'chapter',
    lock: null,
    progress: {
      style: 0,
      edit: 0,
      review: 0,
      clean: 0
    },
    source: '',
    status: 'unpublished',
    subCategory: 'chapter',
    title: 'Chapter One',
    trackChanges: false
  },
  {
    alignment: {
      left: false,
      right: false
    },
    author: '',
    book: book.id,
    comments: {},
    division: 'body',
    index: 0,
    kind: 'chapter',
    lock: null,
    progress: {
      style: 0,
      edit: 0,
      review: 0,
      clean: 0
    },
    source: '',
    status: 'unpublished',
    subCategory: 'chapter',
    title: 'Chapter Two',
    trackChanges: false
  },
  {
    alignment: {
      left: false,
      right: false
    },
    author: '',
    book: book.id,
    comments: {},
    division: 'back',
    index: 0,
    kind: 'chapter',
    lock: null,
    progress: {
      style: 0,
      edit: 0,
      review: 0,
      clean: 0
    },
    source: '',
    status: 'unpublished',
    subCategory: 'component',
    title: 'Preface',
    trackChanges: false
  },
  {
    alignment: {
      left: false,
      right: false
    },
    author: '',
    book: book.id,
    comments: {},
    division: 'back',
    index: 0,
    kind: 'chapter',
    lock: null,
    progress: {
      style: 0,
      edit: 0,
      review: 0,
      clean: 0
    },
    source: '',
    status: 'unpublished',
    subCategory: 'component',
    title: 'Preface',
    trackChanges: false
  }
]

const teams = []

const user = {
  teams: [],
  username: 'test-user'
}

const users = [
  user
]

export {
  book,
  chapters,
  teams,
  user,
  users
}
