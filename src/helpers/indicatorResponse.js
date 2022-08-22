const Indicator = require('../models/indicator');
const User = require('../models/user');

const indicatorByCriterion = async (area) => {
    const indicators = await Indicator.find({ model: true });
    let objectives = [];
    for (objective of area.objectives) {

        let criterions = [];
        for (criterion of objective.criterions) {

            let indicator;
            for (indi of indicators) {

                if (indi.criterion) {
                    if (indi.criterion.equals(criterion._id)) {
                        indicator = { _id: indi._id, name: indi.name, category: indi.category };
                        break;
                    }

                }
            }
            criterions.push({ _id: criterion._id, name: criterion.name, status: criterion.status, todo: criterion.todo, indicator });
        }

        objectives.push({ _id: objective._id, name: objective.name, criterions });
    }

    return objectives;
}

const indicatorsByCategory = async (categories = ['TRABAJO DOCENTE-EDUCATIVO EN PREGRADO Y POSGRADO',
    'TRABAJO POLÍTICO-IDEOLÓGICO', 'TRABAJO METODOLÓGICO', 'TRABAJO DE INVESTIGACIÓN E INNOVACIÓN',
    'SUPERACIÓN'], userId) => {

    let indicators;
    let indicatorsResponse = [];

    if (userId) {
        const user = await User.findById(userId).populate('indicators');

        for (let i = 0; i < categories.length; i++) {
            indicators = [];
            indicatorsResponse.push({ category: categories[i], indicators });
        }

        if (user.indicators.length > 0) {

            user.indicators.forEach(element => {
                for (let i = 0; i < categories.length; i++) {
                    if (element.category === categories[i]) {
                        indicatorsResponse[i].indicators.push(element);
                        break;
                    }
                }
            });
        }

        return indicatorsResponse;
    }

    for (let i = 0; i < categories.length; i++) {
        indicators = await Indicator.find({ category: categories[i], model: true });
        indicatorsResponse.push({ category: categories[i], indicators });
    }

    //indicators = await Indicator.find().sort({field: 'asc', category: 'desc'});
    return indicatorsResponse;
}

const personalIndicators = (categories = ['TRABAJO DOCENTE-EDUCATIVO EN PREGRADO Y POSGRADO',
    'TRABAJO POLÍTICO-IDEOLÓGICO', 'TRABAJO METODOLÓGICO', 'TRABAJO DE INVESTIGACIÓN E INNOVACIÓN',
    'SUPERACIÓN', 'EXTENSIÓN UNIVERSITARIA'], userIndicators) => {
    
    let indicators;
    let indicatorsResponse = [];

    for (let i = 0; i < categories.length; i++) {
        indicators = [];
        indicatorsResponse.push({ category: categories[i], indicators });
    }
    /*indicators = [];
    indicatorsResponse.push({ category: 'Otros', indicators });*/

    userIndicators.forEach(indicator => {
        if (indicator.status) {
            for (let i = 0; i < categories.length; i++) {
                if (indicator.category === categories[i]) {
                    indicatorsResponse[i].indicators.push(indicator);
                    break;
                }
                /*if(i === categories.length - 1){
                    indicatorsResponse[i+1].indicators.push(element);
                }*/
            }
        }
    });

    return indicatorsResponse;
 }

module.exports = { indicatorsByCategory, indicatorByCriterion, personalIndicators }