/**
 * Methode qui fourni l'état du statut du chat en fonction des demandes d'adoption qui lui sont
 * attachées.
 * @param cat
 * @returns {string}
 */
export const catStatus = (cat) => {
    let demandesEnCours = 0;
    let catStatus = "disponible";
    if(!cat.applications || cat.applications.length === 0){
        console.log(cat.name + " est " + catStatus)
        return catStatus;
    }else {
        cat.applications.map((app) => {
            if (app.applicationStatus === "Acceptée"){
                catStatus = "adopté";
                console.log(cat.name + " est " + catStatus)
                return catStatus

            }
            if (app.applicationStatus === "En attente"){
                demandesEnCours = demandesEnCours + 1;
            }
        })
        if (demandesEnCours > 0){
            catStatus = "demande en cours";
        }
        console.log(cat.name + " est " + catStatus)
        return catStatus;
    }
}