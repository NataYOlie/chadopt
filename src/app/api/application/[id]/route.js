import { connectToDB } from "/src/utils/database";
import Application from "/src/models/application";
import User from "/src/models/user";
import Cat from "/src/models/cat";

// DELETE METHOD
export const DELETE = async (request, { params }) => {
    const { cat, user } = await request.json();

    try {
        await connectToDB();

        // Retirer l'application de la liste d'applications du chat
        const tempCat = await Cat.findById(cat._id);
        const applications = tempCat.applications.filter((app) => app._id !== params.id);
        const updatedCat = await Cat.findByIdAndUpdate(cat._id, { applications }, { new: true });

        // Retirer l'application du user.application
        const updatedUser = await User.findByIdAndUpdate(user._id, { application: null }, { new: true });

        // Supprimer l'application de la base de données
        await Application.findByIdAndRemove(params.id);

        // Return success response
        return new Response("Application deleted successfully", { status: 200 });

    } catch (error) {
        return new Response("Failed to delete the application" + error, { status: 500 });
    }
};

//PATCH METHOD (UPDATE) du statut de l'application
export const PATCH = async (request, { params }) => {
    const status = await request.json();
    //"Acceptée", "En attente", "Rejetée"

    try {
        await connectToDB();
        const application = await Application.findById(params.id);
        const patchApplication = new Application({
            ...application,
            applicationStatus: status
        })
        await patchApplication.save();
        return new Response(JSON.stringify(patchApplication), { status: 200 });

    }catch (error) {
        return new Response("Failed to update the application" + error, { status: 500 });
    }
}
