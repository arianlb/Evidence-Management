const path = require('path');
const fs = require('fs');

const { updateCriterion } = require('./modifyCriterion');
const Evidence = require('../models/evidence');
const Indicator = require('../models/indicator');
const User = require('../models/user');
const evidence = require('../models/evidence');

const deleteEvidence = async(id, idIndicator) => {
    const [evidence, indicator] = await Promise.all([
        Evidence.findById(id),
        Indicator.findById(idIndicator)
    ]);

    if(evidence.file){
        const pathFile = path.join( __dirname, '../uploads/evidences/', evidence.file);
        if(fs.existsSync(pathFile)){
            fs.unlinkSync(pathFile);
        }
    }

    if(indicator.evidences.length < 2){
        indicator.status = false;
        indicator.evidences = [];
        if(indicator.criterion){
            updateCriterion(indicator.criterion, -1);
        }
    }
    else {
        for(let i=0; i<indicator.evidences.length; i++){
            if(indicator.evidences[i].equals(evidence._id)){
                indicator.evidences.splice(i, 1);
                break;
            }
        }
    }

    await Promise.all([
        Evidence.findByIdAndDelete(evidence._id),
        indicator.save()
    ]);
}

const deleteIndicator = async(id, idUser) => {
    const [indicator, user] = await Promise.all([
        Indicator.findById(id),
        User.findById(idUser)
    ]);

    for(let i = 0; i < user.indicators.length; i++) {
        if(user.indicators[i].equals(indicator._id)) {
            user.indicators.splice(i, 1);
            break;
        }
    }

    if(indicator.evidences) {
        const evidences = indicator.evidences;
        //evidences.forEach( async(evidence) => await deleteEvidence(evidence, indicator._id));
        //No se puede hacer con un forEach porque se hace de modo asincronico y no respeta el await
        for(let i = 0; i < evidences.length; i++) {
            await deleteEvidence(evidences[i], indicator._id);
        }
    }

    await Promise.all([
        Indicator.findByIdAndDelete(indicator._id),
        user.save()
    ]);
}

module.exports = { deleteEvidence, deleteIndicator }