let {migrateStudents} = require('./students');
let {migrateProfessors} = require('./professors');
let {migrateSubjects} = require('./subjects');
let {migrateAssignments} = require('./assignments');
const bcrypt = require('bcryptjs');

async function migrateAll() {
    // migrateStudents().then(() => {
    //     migrateProfessors().then(() => {
    //         migrateSubjects().then(() => {
    //             migrateAssignments();
    //         });
    //     });
    // });
    pwd = bcrypt.hashSync('admin', 8);
    console.log("pwd: ", pwd);
}

module.exports = {
    migrateAll
}