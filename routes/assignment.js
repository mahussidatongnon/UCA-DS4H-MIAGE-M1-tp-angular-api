let mongoose = require('mongoose');
let Assignment = require('../model/assignment');

// Récupérer tous les assignments (GET)
async function getAssignments(req, res){
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Filtres
    let matchQuery = []

    if (req.query.rendu) {
        matchQuery.push({$match: { rendu: req.query.rendu==="true" }});
    }

    if (req.query.nom) {
        matchQuery.push({
            $match: {
                nom: { $regex: new RegExp(req.query.nom, 'i') }
            }
        });
    }

    if (req.query.subjectId) {
        const subjectId = mongoose.Types.ObjectId(req.query.subjectId);
        matchQuery.push({ $match: { subjectId: subjectId } });
    }

    if (req.query.studentId) {
        const studentId = mongoose.Types.ObjectId(req.query.studentId);
        matchQuery.push({ $match: { studentId: studentId } });
    }

    console.log("matchQuery", matchQuery);
    try {
        const options = {
            page: page,
            limit: limit
        };
        
        let aggregateQuery = Assignment.aggregate(matchQuery);
        const result = await Assignment.aggregatePaginate(aggregateQuery, options);

        // Utilisez populate pour charger les informations des étudiants et des matières associées
        await Assignment.populate(result.docs, { path: 'studentId' });
        await Assignment.populate(result.docs, { path: 'subjectId' });

        res.status(200).send(result);
    } catch (error) {
        console.error("Error finding assignments:", error);
        res.status(500).send("There was a problem finding the assignments.");
    }
}

// Récupérer un assignment par son id (GET)
function getAssignment(req, res){
    let assignmentId = req.params.id;

    Assignment.findOne({id: assignmentId}, (err, assignment) =>{
        if(err){res.send(err)}
        res.json(assignment);
    })
}

// Ajout d'un assignment (POST)
function postAssignment(req, res){
    let assignment = new Assignment();
    assignment.id = req.body.id;
    assignment.nom = req.body.nom;
    assignment.dateDeRendu = req.body.dateDeRendu;
    assignment.rendu = req.body.rendu;

    console.log("POST assignment reçu :");
    console.log(assignment)

    assignment.save( (err) => {
        if(err){
            res.send('cant post assignment ', err);
        }
        res.json({ message: `${assignment.nom} saved!`})
    })
}

// Update d'un assignment (PUT)
function updateAssignment(req, res) {
    console.log("UPDATE recu assignment : ");
    console.log(req.body);
    Assignment.findByIdAndUpdate(req.body._id, req.body, {new: true}, (err, assignment) => {
        if (err) {
            console.log(err);
            res.send(err)
        } else {
          res.json({message: 'updated'})
        }

      // console.log('updated ', assignment)
    });

}

// suppression d'un assignment (DELETE)
function deleteAssignment(req, res) {

    Assignment.findByIdAndRemove(req.params.id, (err, assignment) => {
        if (err) {
            res.send(err);
        }
        res.json({message: `${assignment.nom} deleted`});
    })
}



module.exports = { getAssignments, postAssignment, getAssignment, updateAssignment, deleteAssignment };
