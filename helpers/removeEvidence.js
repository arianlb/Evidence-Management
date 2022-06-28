const path = require('path');
const fs = require('fs');

const { updateCriterion } = require('../helpers/modifyCriterion');
const Evidence = require('../models/evidence');
const Indicator = require('../models/indicator');

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
            }
        }
    }

    await Promise.all([
        Evidence.findByIdAndDelete(evidence._id),
        indicator.save()
    ]);
}

module.exports = { deleteEvidence }