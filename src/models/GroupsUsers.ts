import Sequelize from 'sequelize';
const db = require('./../providers/db');

export default db.define('GroupsUsers', {
    id: {  // Not used. required by msq system var sql_require_primary_key
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
        unique: true
    },
    userID: Sequelize.UUID,
    groupID: Sequelize.UUID,
}, {
    tableName: 'GroupsUsers',
    updatedAt: false,
});
