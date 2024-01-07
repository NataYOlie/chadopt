import { connectToDB } from "/src/utils/database";
import Cat from "/src/models/cat";

// ADMIN methode PATCH pour modifier un chat
// ADMIN methode DELETE pour supprimer un chat
// ADMIN methode POST pour créer un chat


//GET (read)
export const GET = async (request, { params }) => {

    try {
        await connectToDB();

        const cat = await Cat.findById(params.id);
        if(!cat) return new Response("cat not found", { status: 404 })


        console.log("API GET CAT BY ID ");
        return new Response(JSON.stringify(cat), { status:200 });

    } catch (error) {
        return new Response("Failed to fetch the cat " + error, { status: 500 })
    }
}

//PATCH (update)
export const PATCH = async (request, { params }) => {
    const updatedCatData = await request.json();

    try {
        connectToDB();
        const existingCat = await Cat.findById(params.id);
        if (!existingCat) return new Response("Cat not found", { status: 404 });

        // Mettez à jour uniquement les champs spécifiés dans updatedCatData
        Object.assign(existingCat, updatedCatData);

        await existingCat.save();

        return new Response(JSON.stringify(existingCat), { status: 200 });

    } catch (error) {
        return new Response("Failed to patch the cat" + error, { status: 500 });
    }
}

//DELETE
export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        await Cat.findByIdAndDelete(params.id);
        return new Response("Cat deleted successfully", { status: 200 })

    } catch (error) {
        return new Response("Failed to delete the cat" + error, { status: 500 })
    }
}

//MEthode métier pour gérer le process d'adoption

//changer le statut d'adoption d'un chat (user veut adopter > status vers demande en cours)
/*
1 - L'action "Adopter" aura pour but d'envoyer une demande d'adoption. Le client ne pourra plus refaire une demande
pour le même chat mais pourra annuler sa demande en cours.
Les statuts possibles pour un chat sont : Adoptable, Demande en cours, Adopté.
Bien évidemment, on ne peut adopter un chat déjà adopté par quelqu'un d'autre.
2 - Un chat peut faire l'objet de plusieurs adoptions en même temps (par différents clients).
Cette info devra apparaitre côté admin

*/