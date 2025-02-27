import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Product from './Product.js';

const Cart = sequelize.define('Cart', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  userId: { type: DataTypes.UUID, allowNull: false, references: { model: User, key: 'id' } },
  productId: { type: DataTypes.UUID, allowNull: false, references: { model: Product, key: 'id' } },
  quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
  priceAtAdd: { type: DataTypes.FLOAT, allowNull: false },
});

Cart.belongsTo(User, { foreignKey: 'userId' });
Cart.belongsTo(Product, { foreignKey: 'productId' });

export default Cart;
