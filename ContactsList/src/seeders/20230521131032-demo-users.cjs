'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    queryInterface.bulkInsert('Users', [
      {
        fullname: 'John Doe',
        username: 'johny',
        password: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: 'Meagan Walter',
        username: 'mwalter',
        password: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        fullname: 'Mohammad Mahdi Meraji',
        username: 'madmadi',
        password: '123',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },
  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
