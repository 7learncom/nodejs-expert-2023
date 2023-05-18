import { Sequelize } from 'sequelize';
import ContactModel from './contact.js';
import ContactCategoryModel from './contactCategory.js';
import configs from '../configs/database.js';

const sequelize = new Sequelize(
    configs[process.env.NODE_ENV || 'development']
);

const Contact = ContactModel(sequelize);
const ContactCategory = ContactCategoryModel(sequelize);

Contact.hasOne(ContactCategory);
ContactCategory.belongsTo(Contact);

export {sequelize};
export {Contact};
export {ContactCategory};
