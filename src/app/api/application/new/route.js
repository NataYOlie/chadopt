import { connectToDB } from "/src/utils/database";
import Application from "/src/models/application";
import User from "/src/models/user";
import Cat from "/src/models/cat";

export const POST = async (req, res) => {
    const { cat, user } = await req.json();
    const dbUSer = User.findById(user._id);

    if (dbUSer.application){
        return new Response("User already has an application", { status: 400 });
    }else {
        const newApplication = new Application();

        try {
            console.log(cat);
            await connectToDB();
            await newApplication.save();

            // Ajouter l'application dans le cat
            cat.applications.push(newApplication);
            await Cat.findByIdAndUpdate(cat._id, { applications: cat.applications });

            // Ajouter l'application dans le user
            user.application = newApplication;
            await User.findByIdAndUpdate(user._id, { application: user.application }, { new: true });

            // status 201 signifie : created
            return new Response(JSON.stringify(newApplication), { status: 201 });

        } catch (error) {
            // status 500 signifie : server error
            return new Response("Failed to create a new application" + error, { status: 500 });
        }
    }

};