/**
 * Methode pour calculer l'âge du chat à partir de la date de naissance,
 * s'affichera en années, en mois ou en jours selon l'âge du chat
 * @param cat
 * @returns {string}
 */
export const catAge = (cat) => {
    //calculer l'age du chat à partir de sa date de naissance
    const birthdate = new Date(cat.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const month = today.getMonth() - birthdate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthdate.getDate())) {
        age--;
        //si moins de 1 an, envoyer age en mois
        if(age < 1){
            age = Math.round((today - birthdate) / (30 * 24 * 60 * 60 * 1000));
            return age + " mois";
        }
        //si moins de 1 mois, envoyer age en jours
        if(age < 1){
            age = Math.round((today - birthdate) / (24 * 60 * 60 * 1000));
            return age + " jours";
        }
        return age + " ans";
    }

}