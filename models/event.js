'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.belongsTo(models.Location, { foreignKey: 'locationId' })

      Event.belongsTo(models.Host, { foreignKey: 'hostId' })

      Event.hasMany(models.Ticket, { foreignKey: 'eventId' })
    }
  }
  Event.init(
    {
      title: DataTypes.STRING,
      cost: DataTypes.INTEGER,
      locationId: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: 'Event',
      tableName: 'events'
    }
  )
  return Event
}
