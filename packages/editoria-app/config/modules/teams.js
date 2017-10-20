module.exports = {
  teamAuthors: {
    name: 'Author',
    permissions: ['PATCH']
  },
  teamCopyEditor: {
    name: 'Copy Editor',
    permissions: ['PATCH']
  },
  teamProduction: {
    name: 'Production Editor',
    permissions: ['GET', 'POST', 'PATCH', 'DELETE']
  }
}
