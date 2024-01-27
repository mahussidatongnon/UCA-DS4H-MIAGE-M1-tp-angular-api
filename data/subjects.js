const {professors} = require("../data/professors")
const subjectUrl = "https://jeff-uca-angular-final.s3.eu-west-3.amazonaws.com/assets/subject.jpeg"
var subjects = [
    {
        name: "Mathématiques pour le Big Data",
        professors: [professors.donati]
    },
    {
        name: "Javascript HTML5",
        professors: [professors.buffa, professors.donati]
    },
    {
        name: "Fonctionnement SGBD",
        professors: [professors.galli]
    },
    {
        name: "Anglais",
        professors: [professors.lavit]
    },
    {
        name: "Management des SI",
        professors: [professors.tounsi]
    },
    {
        name: "Communication for business",
        "professors": [professors.anault]
    },
    {
        name: "Planfication de projet",
        professors: [professors.winter]
    },
    {
        name: "Programmation avancée",
        professors: [professors.winter]
    }
]

module.exports = {
    subjects,
    subjectUrl
};