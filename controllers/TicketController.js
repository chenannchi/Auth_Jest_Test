const { Ticket, User, Event } = require('../models')

class TicketController {
  async getAllTickets(req, res) {
    try {
      const tickets = await Ticket.findAll({ include: [User, Event] })

      // if (tickets){
      return res.status(200).json({ tickets })
      // }
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }

  async getTicketById(req, res) {
    try {
      const { id } = req.params
      const ticket = await Ticket.findOne({
        where: { id: id },
        include: [User, Event]
      })

      if (ticket) {
        return res.status(200).json({ ticket })
      }
      return res.status(404).send('Ticket with the specified ID does not exist')
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }

  async createTicket(req, res) {
    try {
      const ticket = await Ticket.create(req.body)
      if (ticket) {
        return res.status(201).json({ ticket })
      }
      throw new Error('Ticket creation failed')
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }

  async updateTicket(req, res) {
    try {
      const { id } = req.params
      const [updated] = await Ticket.update(req.body, { where: { id: id } })
      if (updated) {
        const updatedTicket = await Ticket.findOne({
          where: { id: id },
          include: [User, Event]
        })
        return res.status(200).json({ ticket: updatedTicket })
      }
      throw new Error(`Ticket with id of ${id} is not found`)
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }

  async deleteTicket(req, res) {
    try {
      const { id } = req.params
      const deleted = await Ticket.destroy({ where: { id: id } })
      if (deleted) {
        return res.status(204).send('Ticket deleted')
      }
      throw new Error('Ticket not found')
    } catch (error) {
      return res.status(500).send(error.message)
    }
  }
}

module.exports = new TicketController()
