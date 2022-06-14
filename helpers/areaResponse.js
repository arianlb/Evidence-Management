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

module.exports = {indicatorByCriterion}