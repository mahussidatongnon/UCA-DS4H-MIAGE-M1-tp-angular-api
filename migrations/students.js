let User = require('../model/user');
let Student = require('../model/student');
let bcrypt = require('bcryptjs');

async function createOrUpdateStudent(studentData) {
    try {
        // Vérifiez si l'utilisateur existe déjà
        let existingUser = await User.findOne({ login: studentData.login });

        // Si l'utilisateur existe, mettez à jour ses informations
        if (existingUser) {
            // existingUser.email = studentData.email; // Mettez à jour d'autres champs si nécessaire
            // await existingUser.save();
        } else {
            // Sinon, créez un nouvel utilisateur
            let hashedPassword = bcrypt.hashSync(studentData.login, 8);
            existingUser = await User.create({
                login: studentData.login,
                email: studentData.email,
                role: 'student',
                active: true,
                password : hashedPassword
                // Autres champs du modèle User si nécessaire
            });
        }

        // Créez ou mettez à jour le document Student associé
        let student = await Student.findOneAndUpdate(
            { userId: existingUser._id },
            {
                $set: {
                    lastName: studentData.lastName,
                    firstName: studentData.firstName,
                    pictureUrl: studentData.pictureUrl,
                    userId: existingUser._id
                }
            },
            { upsert: true, new: true }
        );

        return student;
    } catch (error) {
        console.error("Erreur lors de la création ou de la mise à jour de l'étudiant :", error);
        throw error;
    }
}



async function migrateStudents() {
    let students = require('../data/students');
    for (let studentData of students) {
        createOrUpdateStudent(studentData)
            .then(student => {
                console.log("Étudiant créé ou mis à jour avec succès :", student);
            })
            .catch(error => {
                console.error("Erreur lors de la création ou de la mise à jour de l'étudiant :", error);
            });
    }
}

module.exports = {
    migrateStudents
}