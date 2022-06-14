const indicator = require('../models/indicator');
const Indicator = require('../models/indicator');

const indicatorByCriterion = async (area) => {
    const indicators = await Indicator.find( {model: true} );
    let objectives = [];
    for(objective of area.objectives){

        let criterions = [];
        for(criterion of objective.criterions){

            let indicator;
            for(indi of indicators){
                
                if(indi.criterion){
                    if(indi.criterion.equals(criterion._id)){
                        indicator = {_id: indi._id, name: indi.name};
                        break;
                    }

                }
            }
            criterions.push({_id: criterion._id, name: criterion.name, indicator});
        }

        objectives.push({_id: objective._id, name: objective.name, criterions});
    }

    return objectives;
}

const indicatorsByCategory = async(categories = ['TRABAJO DOCENTE-EDUCATIVO EN PREGRADO Y POSGRADO',
'TRABAJO POLÍTICO-IDEOLÓGICO', 'TRABAJO METODOLÓGICO', 'TRABAJO DE INVESTIGACIÓN E INNOVACIÓN',
'SUPERACIÓN']) => {

    let indicators;
    let indicatorsResponse = [];
    for(let i = 0; i < categories.length; i++) {
        indicators = await Indicator.find({category: categories[i]});
        indicatorsResponse.push({category: categories[i], indicators});
    }

    //indicators = await Indicator.find().sort({field: 'asc', category: 'desc'});
    //indicators.sort({field: 'asc', category: 'desc'});
    return indicatorsResponse;
}

module.exports = { indicatorsByCategory, indicatorByCriterion }