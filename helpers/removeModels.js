const path = require('path');
const fs = require('fs');

const { updateCriterion } = require('./modifyCriterion');
const Area = require('../models/area');
const Criterion = require('../models/criterion');
const Evidence = require('../models/evidence');
const Indicator = require('../models/indicator');
const Objective = require('../models/objective');
const User = require('../models/user');
const area = require('../models/area');

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
        for(evidence of evidences) {
            await deleteEvidence(evidence, indicator._id);
        }
    }

    await Promise.all([
        Indicator.findByIdAndDelete(indicator._id),
        user.save()
    ]);
}

const deleteCriterion = async(id, idObjective) => {
    const [ criterion, objective ] = await Promise.all([
        Criterion.findById(id),
        Objective.findById(idObjective)
    ]);

    for(let i = 0; i < objective.criterions.length; i++) {
        if(objective.criterions[i].equals(criterion._id)) {
            objective.criterions.splice(i, 1);
            break;
        }
    }

    const [ indicatorModel, indicators ] = await Promise.all([
        Indicator.findOneAndDelete( {model: true, criterion: criterion._id} ),
        Indicator.find({model: false, criterion: criterion._id})
    ]);

    for(indicator of indicators) {
        indicator.criterion = undefined;
        await indicator.save();
    }

    await Promise.all([
        Criterion.findByIdAndDelete(criterion._id),
        objective.save()
    ]);
}

const deleteObjective = async(id, idArea) => {
    const [objective, area] = await Promise.all([
        Objective.findById(id),
        Area.findById(idArea)
    ]);

    for(let i = 0; i < area.objectives.length; i++) {
        if(area.objectives[i].equals(objective._id)) {
            area.objectives.splice(i, 1);
            break;
        }
    }

    if(objective.criterions) {
        const criterions = objective.criterions;
        for(criterion of criterions) {
            await deleteCriterion(criterion, objective._id);
        }
    }

    await Promise.all([
        Objective.findByIdAndDelete(objective._id),
        area.save()
    ]);
}

const deleteArea = async(id) => {
    const area = await Area.findById(id);

    if(area.objectives) {
        const objectives = area.objectives;
        for(objective of objectives) {
            await deleteObjective(objective, area._id);
        }
    }

    await Area.findByIdAndDelete(area._id);
}

const deleteUser = async(id) => {
    const [ user, areas ] = await Promise.all([
        User.findByIdAndUpdate(id, {status: false}),
        Area.find()
    ]);

    for(area of areas) {
        for(let i = 0; i < area.users.length; i++) {
            if(area.users[i].equals(user._id)) {
                area.users.splice(i, 1);
                await area.save();
                break;
            }
        }
    }
}

module.exports = { deleteArea, deleteCriterion, deleteEvidence, deleteIndicator, deleteObjective, deleteUser }