
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

module.exports = {percentage}