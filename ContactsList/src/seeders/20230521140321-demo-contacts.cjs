'use strict';

const path = require('path');
const { readFile } = require('fs/promises');
const { faker } = require('@faker-js/faker');

const PROFILE_PICTURES_BASE_PATH = path.resolve('src', 'seeders', 'profilePictures');

function getRandomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

async function generateSampleContacts({ count, ContactCategories, Users }) {
  const data = [];

  for (let i = 1; i <= count; i++) {
    const profilePicture = await readFile(`${PROFILE_PICTURES_BASE_PATH}/${getRandomNumber(1, 6)}.jpg`);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const mobilePhone = faker.phone.number('+98#########');
    const isFavorite = faker.datatype.boolean();
    const createdAt = faker.date.past();
    const updatedAt = faker.date.recent();
    const ContactCategoryId = ContactCategories[getRandomNumber(0, ContactCategories.length - 1)].id;
    const UserId = Users[getRandomNumber(0, Users.length - 1)].id;

    const record = {
      profilePicture,
      firstName,
      lastName,
      mobilePhone,
      isFavorite,
      createdAt,
      updatedAt,
      ContactCategoryId,
      UserId,
    };

    data.push(record);
  }

  return data;
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const [ContactCategories] = await queryInterface.sequelize.query('SELECT id FROM "ContactCategories";');
    const [Users] = await queryInterface.sequelize.query('SELECT id FROM "Users";');

    await queryInterface.bulkInsert(
      'Contacts',
      await generateSampleContacts({ count: 500, ContactCategories, Users }),
    );
  },
  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Contacts', null, {});
  }
};
