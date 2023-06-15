process.env.NODE_ENV = 'test'
const request = require('supertest')
const app = require('../server')
const { createToken, hashPassword } = require('../middleware')
const { User, Location, Event, Host } = require('../models')

let testToken

describe('Event controller tests', () => {
  let testUser
  let testLocation
  let testEvent
  let testLocationId
  let testEventId
  let testHost, testHostId

  beforeAll(async () => {
    // Create test user
    testUser = await User.create({
      username: 'testuser',
      passwordDigest: await hashPassword('testpassword')
    })
    testToken = createToken({
      id: testUser.id,
      username: testUser.username,
      passwordDigest: testUser.passwordDigest
    })

    // Create location
    testLocation = await Location.create({
      venueName: 'testVenue',
      walkable: true
    })
    testLocationId = testLocation.id

    // Create host
    testHost = await Host.create({
      hostname: 'ABC Company'
    })
    testHostId = testHost.id

    // Create event
    testEvent = await Event.create({
      title: 'testEvent',
      cost: 100,
      locationId: testLocationId,
      hostId: testHostId
    })
    testEventId = testEvent.id
  })

  test('Create event', async () => {
    const response = await request(app)
      .post('/api/event')
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        title: 'newTestEvent',
        cost: 50,
        locationId: testLocationId,
        hostId: testHostId,
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.event.title).toBe('newTestEvent')
    expect(response.body.event.cost).toBe(50)
  })

  test('Get all events', async () => {
    const response = await request(app)
      .get('/api/event')
      .set('Authorization', `Bearer ${testToken}`)

    expect(response.statusCode).toBe(200)
    expect(Array.isArray(response.body.events)).toBeTruthy()
    expect(response.body.events.length).toBeGreaterThan(0)
  })

  test('Get event by id', async () => {
    const response = await request(app)
      .get(`/api/event/${testEventId}`)
      .set('Authorization', `Bearer ${testToken}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.event.title).toBe(testEvent.title)
    expect(response.body.event.cost).toBe(testEvent.cost)
  })

  test('Update event', async () => {
    const response = await request(app)
      .put(`/api/event/${testEventId}`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({
        title: 'updatedTestEvent',
        cost: 200
      })

    expect(response.statusCode).toBe(200)
    expect(response.body.event.title).toBe('updatedTestEvent')
    expect(response.body.event.cost).toBe(200)
  })

  test('Delete event', async () => {
    const response = await request(app)
      .delete(`/api/event/${testEventId}`)
      .set('Authorization', `Bearer ${testToken}`)

    expect(response.statusCode).toBe(204)
  })

  afterAll(async () => {
    try {
      await User.destroy({ truncate: { cascade: true } })
      await Location.destroy({ truncate: { cascade: true } })
      await Event.destroy({ truncate: { cascade: true } })
    } catch (error) {
      console.log('Error cleaning up test data: ', error)
    }
  })
})
