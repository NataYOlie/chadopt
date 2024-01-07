import { connectToDB } from "/src/utils/database";
import Application from "/src/models/application";
import User from "/src/models/user";
import Cat from "/src/models/cat";

/**
 * Mise à jour du statut d'une demande d'adoption
 */
//PATCH METHOD (UPDATE) du statut de l'application
export const PATCH = async (request, { params }) => {
    console.log("PATCH APPLICATION")
    console.log(params.id)
    const status = await request.json();

    console.log(status)
    

    try {
        await connectToDB();
        const application = await Application.findById(params.id);
        if (!application) return new Response("Application not found", { status: 404 });

        // Mise à jour l'application existante
        application.applicationStatus = status;

        // Enregistrement de la mise à jour dans la base de données
        await application.save();

        return new Response(JSON.stringify(application), { status: 200 });

    } catch (error) {
        return new Response("Failed to update the application " + error, { status: 500 });
    }
};


// DELETE METHOD
export const DELETE = async (request, { params }) => {
    const { cat, user } = await request.json();

    try {
        await connectToDB();

        // Retirer l'application de la liste d'applications du chat
        const tempCat = await Cat.findById(cat._id);
        const applications = tempCat.applications.filter((app) => app._id.toString() !== params.id.toString());

        const updatedCat = await Cat.findOneAndUpdate(
            { _id: cat._id }, // Filter criteria
            { applications }, // Update
            { new: true }
        );

        // Retirer l'application du user.application
        const updatedUser = await User.findOneAndUpdate(
            { _id: user._id }, // Filter criteria
            { application: null }, // Update
            { new: true }
        );

        // Supprimer l'application de la base de données
        await Application.findOneAndDelete({ _id: params.id });

        // Return success response
        return new Response("Application deleted successfully", { status: 200 });

    } catch (error) {
        return new Response("Failed to delete the application" + error, { status: 500 });
    }
};

/**
 * Méthode pour récupérer le user lié à un numéro de demande d'adoption
 */
//GET pour trouver le user selon une application
export const GET = async (request, { params }) => {
    try {
        await connectToDB();
        console.log(params.id)
        //On récupère l'application
        const application = await Application.findById(params.id);

        if (!application) {
            return new Response("Application not found", { status: 404 });
        }

        //et a partir de l'Id (ObjectId) on récupère le user 
        const user = await User.findOne({ application: application._id });

            if (!user) {
                return new Response("User not found", { status: 404 });
            }

        return new Response(JSON.stringify(user), { status: 200 });

    } catch (error) {
        return new Response("Failed to get user for this application: " + error, { status: 500 });
    }
};