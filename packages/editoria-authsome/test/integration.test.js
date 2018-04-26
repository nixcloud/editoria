// const { User, Collection, Team } = require('pubsweet-server/src/models')

// // Perhaps these should be exported from server together?
// const cleanDB = require('pubsweet-server/test/helpers/db_cleaner')
// const fixtures = require('./fixtures/fixtures')
// const api = require('pubsweet-server/test/helpers/api')
// const authentication = require('pubsweet-server/src/authentication')

// let adminToken
// let userToken
// let admin
// let user

// const collectionPaper1 = {
//   title: 'Paper 1',
//   status: 'submitted',
//   type: 'collection',
// }

// describe('server integration', () => {
//   beforeEach(async () => {
//     await cleanDB()
//     admin = await new User(fixtures.adminUser).save()
//     user = await new User(fixtures.user).save()
//     adminToken = authentication.token.create(admin)
//     userToken = authentication.token.create(user)
//   })

//   describe('admin', () => {
//     it('can create a collection with REST', async () => {
//       const collection = await api.collections
//         .create(collectionPaper1, adminToken)
//         .expect(201)
//         .then(res => res.body)

//       expect(collection.type).toEqual(fixtures.collection.type)
//     })
//   })

//   describe('user', () => {
//     describe('REST', () => {
//       it('can create a collection with REST', async () => {
//         const collection = await api.collections
//           .create(collectionPaper1, userToken)
//           .expect(201)
//           .then(res => res.body)

//         expect(collection.type).toEqual(fixtures.collection.type)
//       })
//     })
//   })

//   describe('managing editor', () => {
//     describe('REST', () => {
//       let editorToken
//       beforeEach(async () => {
//         const editor = await new User(
//           Object.assign({}, fixtures.user, {
//             username: 'testeditor',
//             email: 'testeditor@example.com',
//           }),
//         ).save()

//         await new Team({
//           name: 'Managing Editors',
//           teamType: 'managingEditor',
//           members: [editor.id],
//         }).save()
//         const paperA = new Collection({ title: 'Paper A' })
//         const paperB = new Collection({ title: 'Paper B' })

//         paperA.setOwners([user.id])
//         paperB.setOwners([admin.id])
//         await paperA.save()
//         await paperB.save()

//         editorToken = authentication.token.create(editor)
//       })

//       it('can list all collections', async () => {
//         const collections = await api.collections
//           .list(editorToken)
//           .expect(200)
//           .then(res => res.body)

//         expect(collections).toHaveLength(2)
//       })
//     })
//   })
// })
