const Assignment = require('../model/assignment');
const Student = require('../model/student');
const Subject = require('../model/subject');
const mongoose = require('mongoose');
const bdInitialAssignments = require('../data/assignments');
const subject = require('../model/subject');

async function assignAssignmentsToStudents(assignmentList) {
    try {
        // Récupérez tous les étudiants
        const students = await Student.find();
        const subjects = await Subject.find();


        // Parcourez chaque objet de la liste d'assignments
        for (const assignmentData of assignmentList) {
            // Générez un index aléatoire pour choisir un étudiant au hasard
            const randomIndex = Math.floor(Math.random() * students.length);
            const randomStudent = students[randomIndex];

            const randomSubjectIndex = Math.floor(Math.random() * subjects.length);
            const randomSubject = subjects[randomSubjectIndex];

            // Créez un nouvel assignment associé à l'étudiant au hasard
            let assignment = await Assignment.findOneAndUpdate(
                { nom: assignmentData.nom }, 
                {
                    $set: {
                        studentId: randomStudent._id, 
                        subjectId: randomSubject._id,
                        nom: assignmentData.nom,
                        rendu: assignmentData.rendu,
                        dateDeRendu: new Date(assignmentData.dateDeRendu.$date),
                    }
                },
                { upsert: true, new: true }
            );
        }

        console.log("Assignments créés avec succès !");
    } catch (error) {
        console.error("Erreur lors de l'assignation des assignments aux étudiants :", error);
        throw error;
    }
}


async function migrateAssignments() {
    assignAssignmentsToStudents(bdInitialAssignments)
    .then(() => {
        console.log("Assignments assignés avec succès aux étudiants !");
    })
    .catch(error => {
        console.error("Erreur lors de l'assignation des assignments aux étudiants :", error);
    });
}

module.exports = {
    migrateAssignments,
    assignAssignmentsToStudents
}