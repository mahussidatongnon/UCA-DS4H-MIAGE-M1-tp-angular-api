let User = require('../model/user');    
let Professor = require('../model/professor');
let bcrypt = require('bcryptjs');
let slugify = require('slugify');

async function  createOrUpdateProfessor(professorData) {
    try {
        console.log("professorData: ", professorData);
        console.log("professorData.lastName: ", professorData.lastName);
        professorLogin = slugify(professorData.lastName + " " + professorData.firstName, {lower: true});
        console.log("professorLogin: ", professorLogin);
        let existingUser = await User.findOne({ login: professorLogin });
        
        if (existingUser) {
            // existingUser.email = professorData.email; // Mettez à jour d'autres champs si nécessaire
            // await existingUser.save();
        } else {
            // Sinon, créez un nouvel utilisateur
            let hashedPassword = bcrypt.hashSync(professorLogin, 8);
            existingUser = await User.create({
                login: professorLogin,
                email: professorData.email,
                role: 'professor',
                active: true,
                password : hashedPassword
                // Autres champs du modèle User si nécessaire
            });
        }

        let professor = await Professor.findOneAndUpdate(
            { userId: existingUser._id },
            {
                $set: {
                    lastName: professorData.lastName,
                    firstName: professorData.firstName,
                    pictureUrl: professorData.pictureUrl,
                    userId: existingUser._id
                }
            },
            { upsert: true, new: true }
        );

        console.log("Professeur créé ou mis à jour avec succès :", professor);
        return professor;

    } catch (error) {
        console.error("Erreur lors de la création ou de la mise à jour du professeur :", error);
        throw error;
    }
}

async function migrateProfessors() {
    let {professors} = require('../data/professors');
    for (const professorKey in professors) {
        console.log("professorKey: ", professorKey);
        if (Object.hasOwnProperty.call(professors, professorKey)) {
            const professorData = professors[professorKey];
            console.log("professorData: ", professorData);
            createOrUpdateProfessor(professorData)    
        }
    }
}

module.exports = {
    migrateProfessors,
    createOrUpdateProfessor
}