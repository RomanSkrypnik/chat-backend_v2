'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const bcrypt = require('bcrypt');
    const crypto = require('crypto');

      return queryInterface.bulkInsert('users', [

        {
          username: 'rorchenko',
          name: 'rorchenko',
          password: await bcrypt.hash('rorchenko', 3),
          email: 'rorchenko@gmail.com',
          hash: crypto.randomBytes(20).toString('hex'),
          statusId: 1,
          activity: 'Computer science',
        },

        {
          username: 'jekyll',
          name: 'jekyll',
          password: await bcrypt.hash('jekyll228', 3),
          email: 'jekyll@gmail.com',
          hash: crypto.randomBytes(20).toString('hex'),
          statusId: 2,
          activity: 'Gold seller',
        },

        {
          username: 'slinkin',
          name: 'slinkin',
          password: await bcrypt.hash('slinkin', 3),
          email: 'slinkin@gmail.com',
          hash: crypto.randomBytes(20).toString('hex'),
          statusId: 3,
          activity: 'Local youtuber',
        },

      ]);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
