'use strict';

const { User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

///** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await User.bulkCreate([
    {
      firstName: 'Tester',
      lastName: 'McTesterson',
      email: 'test@simon.site',
      username: 'TesterMcTesterson',
      hashedPassword: bcrypt.hashSync('superSecurePass')
    },
    {
      firstName: 'Simon',
      lastName: 'Snow',
      email: 'simonsnow@watford.edu',
      username: 'SimonSnow',
      hashedPassword: bcrypt.hashSync('TheChosen1')
    },
    {
      firstName: 'Tyrannus',//note to self, should I edit the constraints to allow hyphens and spaces? maybe ask in office hours
      lastName: 'Pitch',
      email: 'tyrannusbasiltongrimmpitch@watford.edu',
      username: 'BazGrimmPitch',
      hashedPassword: bcrypt.hashSync('actuallyAVampire')
    },
    {
      firstName: 'Penelope',
      lastName: 'Bunce',
      email: 'penelopebunce@watford.edu',
      username: 'PenelopeBunce',
      hashedPassword: bcrypt.hashSync('micahBunce')
    },
    {
      firstName: 'Agatha',
      lastName: 'Wellbelove',
      email: 'agathawellbelove@watford.edu',
      username: 'AgathaWellbelove',
      hashedPassword: bcrypt.hashSync('iLoveLucy')
    },
    // {
    //   email: 'demo@user.io',
    //   username: 'Demo-lition',
    //   hashedPassword: bcrypt.hashSync('password')
    // },
    // {
    //   email: 'user1@user.io',
    //   username: 'FakeUser1',
    //   hashedPassword: bcrypt.hashSync('password2')
    // },
    // {
    //   email: 'user2@user.io',
    //   username: 'FakeUser2',
    //   hashedPassword: bcrypt.hashSync('password3')
    // },
   ],{ validate: true });
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Users';
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      username: { [Op.in]: ['TesterMcTesterson', 'SimonSnow','BazGrimmPitch', 'PenelopeBunce', 'AgathaWellbelove']}
    }, {});
  }
};
// 'use strict';

// const { User } = require('../models');
// const bcrypt = require("bcryptjs");

// let options = {};
// if (process.env.NODE_ENV === 'production') {
//   options.schema = process.env.SCHEMA;  // define your schema in options object
// }

// module.exports = {
//   async up (queryInterface, Sequelize) {
//     await User.bulkCreate([
//       {
//         email: 'demo@user.io',
//         username: 'Demo-lition',
//         hashedPassword: bcrypt.hashSync('password')
//       },
//       {
//         email: 'user1@user.io',
//         username: 'FakeUser1',
//         hashedPassword: bcrypt.hashSync('password2')
//       },
//       {
//         email: 'user2@user.io',
//         username: 'FakeUser2',
//         hashedPassword: bcrypt.hashSync('password3')
//       }
//     ], { validate: true });
//   },

//   async down (queryInterface, Sequelize) {
//     options.tableName = 'Users';
//     const Op = Sequelize.Op;
//     return queryInterface.bulkDelete(options, {
//       username: { [Op.in]: ['Demo-lition', 'FakeUser1', 'FakeUser2'] }
//     }, {});
//   }
// };
