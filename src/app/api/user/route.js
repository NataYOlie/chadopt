import {connectToDB} from "@/utils/database";
import User from "@/models/user";


//PATCH pour modifier un user
export const PATCH = async (request) => {
    try {
        const { _id, favorites } = await request.json();
        await connectToDB();

        // Vérifier si le chat est déjà dans les favoris
        const user = await User.findById(_id);
        console.log(user)
        console.log(favorites)

        const patchUser = await User.findByIdAndUpdate(_id, { favorites }, { new: true });

        if (!patchUser) {
            return new Response("User not found", { status: 404 });
        }

        console.log("API PATCH USER : " + patchUser);
        return new Response(JSON.stringify(patchUser), { status: 200 });
    } catch (error) {
        return new Response("Failed to patch user: " + error, { status: 500 });
    }
};