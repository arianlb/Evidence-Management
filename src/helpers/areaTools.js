const Area = require('../models/area');
const Criterion = require('../models/criterion');
const Indicator = require('../models/indicator');
const Objective = require('../models/objective');

const percentage = ( objectives ) => {
    let total = 0;
    let part = 0;
    for(objective of objectives) {
        if(objective.criterions) {
            
            total += objective.criterions.length;
            for(criterion of objective.criterions) {
                if(criterion.status === 'Cumplido' || criterion.status === 'Sobre Cumplido') {
                    part += 1;
                }
            }

        }
    }

    if(part === 0) return 0;

    return (part * 100) / total;
}

const createAllNew = async (lastYear, newYear) => { 
    const areas = await Area.find({ year: lastYear }).populate({
        path: 'objectives',
        populate: { path: 'criterions' }
    });

    let areaResponse = [];
    for (area of areas) {
        const newArea = new Area({ name: area.name, year: newYear, objectives: [] });
        for (objective of area.objectives) {
            const newObjective = new Objective({ name: objective.name, criterions: [] });
            for (criterion of objective.criterions) {
                const indicator = await Indicator.findOne({ model: true, criterion: criterion._id, year: lastYear });
                const newCriterion = new Criterion({ name: criterion.name, status: criterion.status, todo: criterion.todo, concluded: criterion.concluded });
                
                if (indicator) { 
                    const newIndicator = new Indicator({
                        name: indicator.name,
                        category: indicator.category,
                        department: indicator.department,
                        year: newYear,
                        criterion: newCriterion._id,
                    });
                    await newIndicator.save();
                }
                await newCriterion.save();
                newObjective.criterions.push(newCriterion._id);
            }

            await newObjective.save();
            newArea.objectives.push(newObjective._id);
        }
        
        await newArea.save();
        areaResponse.push(newArea);
    }

    return areaResponse;
}

module.exports = { createAllNew, percentage }