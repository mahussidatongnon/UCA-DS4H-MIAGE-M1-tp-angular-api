let Subject = require('../model/subject');
let Professor = require('../model/professor');
let { createOrUpdateProfessor } = require('./professors');
let {subjects, subjectUrl} = require('../data/subjects');

async function createOrUpdateSubject(subjectData) {
    try {
        let subject = await Subject.findOne({ name: subjectData.name });

        if (subject) {
            // subject.name = subjectData.name; // Mettez à jour d'autres champs si nécessaire
            // await subject.save();
        } else {
            let professorIds = [];
            for (let profData of subjectData.professors) {
                let professor = await Professor.findOne({ lastName: profData.lastName, firstName: profData.firstName });
                if (professor) {
                    professorIds.push(professor._id);
                } else {
                    professor = await createOrUpdateProfessor(profData);
                    professorIds.push(professor._id);
                }
            }
            subject = await Subject.create({
                name: subjectData.name,
                imageUrl: subjectUrl,
                professorIds: professorIds
            });
        }
        console.log("Sujet créé ou mis à jour avec succès :", subject);
        return subject;
    } catch (error) {
        console.error("Erreur lors de la création ou de la mise à jour du sujet :", error);
        throw error;
    }
}

async function migrateSubjects() {
    for (let subjectData of subjects) {
        createOrUpdateSubject(subjectData)
            .then(subject => {
                console.log("Sujet créé ou mis à jour avec succès :", subject);
            })
            .catch(error => {
                console.error("Erreur lors de la création ou de la mise à jour du sujet :", error);
            });
    }
}

module.exports = {
    migrateSubjects,
    createOrUpdateSubject
}