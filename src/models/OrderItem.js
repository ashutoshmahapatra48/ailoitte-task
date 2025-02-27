import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Order from './Order.js';
import Product from './Product.js';

const OrderItem = sequelize.define('OrderItem', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  orderId: { type: DataTypes.UUID, allowNull: false, references: { model: Order, key: 'id' } },
  productId: { type: DataTypes.UUID, allowNull: false, references: { model: Product, key: 'id' } },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  priceAtOrder: { type: DataTypes.FLOAT, allowNull: false },
});

Order.hasMany(OrderItem, { foreignKey: 'orderId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId', onDelete: 'CASCADE' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

export default OrderItem;
