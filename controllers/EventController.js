const { Event, Location, Host } = require('../models')

class EventController {
  async getAllEvents(req, res) {
    try {
      const events = await Event.findAll({ include: [Location, Host] })
      return res.status(200).json({ events })
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }

  async getEventById(req, res) {
    try {
      const { id } = req.params
      const event = await Event.findOne({
        where: { id: id },
        include: [Location, Host]
      })
      if (event) {
        return res.status(200).json({ event })
      }
      return res.status(404).send('Event with the specified ID does not exists')
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }

  async createEvent(req, res) {
    try {
      const event = await Event.create(req.body)
      if (event) {
        return res.status(201).json({ event })
      }
      throw new Error('Event creation failed')
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }

  async updateEvent(req, res) {
    try {
      const { id } = req.params
      const [updated] = await Event.update(req.body, {
        where: { id: id }
      })
      if (updated) {
        const updatedEvent = await Event.findOne({
          where: { id: id },
          include: [Location, Host]
        })
        return res.status(200).json({ event: updatedEvent })
      }
      throw new Error('Event not found')
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }

  async deleteEvent(req, res) {
    try {
      const { id } = req.params
      const deleted = await Event.destroy({
        where: { id: id }
      })
      if (deleted) {
        return res.status(204).send('Event deleted')
      }
      throw new Error('Event not found')
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }
}

module.exports = new EventController()
