import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Order = sequelize.define('Order', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
  totalAmount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'completed', 'cancelled'), defaultValue: 'pending' },
});

Order.belongsTo(User, { foreignKey: 'userId' });

export default Order;
