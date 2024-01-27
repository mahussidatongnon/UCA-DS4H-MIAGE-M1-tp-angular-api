let {migrateStudents} = require('./students');
let {migrateProfessors} = require('./professors');
let {migrateSubjects} = require('./subjects');
let {migrateAssignments} = require('./assignments');

async function migrateAll() {
    migrateStudents().then(() => {
        migrateProfessors().then(() => {
            migrateSubjects().then(() => {
                migrateAssignments();
            });
        });
    });
}

module.exports = {
    migrateAll
}