//Methode pour changer le statut d'adoption d'un chat (user veut adopter > status vers application in progress)
    /*
    1 - L'action "Adopter" aura pour but d'envoyer une demande d'adoption. Le client ne pourra plus refaire une demande
    pour le même chat mais pourra annuler sa demande en cours.
    Les statuts possibles pour un chat sont : Adoptable, Demande en cours, Adopté.
    Bien évidemment, on ne peut adopter un chat déjà adopté par quelqu'un d'autre.
    2 - Un chat peut faire l'objet de plusieurs adoptions en même temps (par différents clients).
    Cette info devra apparaitre côté admin

    */

// ADMIN methode pour récupérer les user l'ayant mis en favori
// ADMIN methode pour récupérer les user ayant fait une demande d'adoption

// ADMIN methode PATCH pour modifier un chat
// ADMIN methode DELETE pour supprimer un chat
// ADMIN methode POST pour créer un chat