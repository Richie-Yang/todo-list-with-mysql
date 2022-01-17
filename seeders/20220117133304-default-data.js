'use strict';
const bcrypt = require('bcryptjs')
const SEED_USER = {
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}

module.exports = {
  async up (queryInterface, Sequelize) {
   try {
     /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     const userId = await queryInterface.bulkInsert('Users', [{
       name: SEED_USER.name,
       email: SEED_USER.email,
       password: bcrypt.hashSync(SEED_USER.password, bcrypt.genSaltSync(10), null),
       createdAt: new Date(),
       updatedAt: new Date()
     }], {})

     return await queryInterface.bulkInsert('Todos',
       Array.from(Array(10), (_, i) => ({
         name: `name-${i}`,
         UserId: userId,
         createdAt: new Date(),
         updatedAt: new Date()
       }))
       , {})
   } catch (err) { console.log(err) }
  },

  async down (queryInterface, Sequelize) {
    try {
      /**
       * Add commands to revert seed here.
       *
       * Example:
       * await queryInterface.bulkDelete('People', null, {});
       */
      await queryInterface.bulkDelete('Todos', null, {})
      return await queryInterface.bulkDelete('Users', null, {})
    } catch (err) { console.log(err) }
  }
};
