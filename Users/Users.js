const Sequelize = require('sequelize'); 
const connection = require('../databases/database');


const User = connection.define('users', {
       email: { 
        type: Sequelize.STRING,
        allowNull: false
       },
       password: {
        type: Sequelize.STRING,
        allowNull: false
       },
       
});

User.sync({force : false});

module.exports = User;