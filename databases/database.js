const Sequelize = require('sequelize');
const connection = new Sequelize('blog_project','root','******',{
        host: 'localhost',
        dialect: 'mysql',
        timezone: '-03:00'
})

module.exports = connection;
