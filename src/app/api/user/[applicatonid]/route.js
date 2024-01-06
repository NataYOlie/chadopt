import {connectToDB} from "@/utils/database";
import User from "@/models/user";

//GET pour trouver le user selon une application
export const GET = async (request, params) => {

    try {
        const { applicationId } = params;
        if (!applicationId) {
            return new Response("Application parameter is missing", { status: 400 });
        }
        await connectToDB();
        const user = await User.findOne({ "application._id": applicationId });
        if (!user) {
            return new Response("User not found", { status: 404 });
        }
        return new Response(JSON.stringify(user), { status: 200 });

    }catch (error) {
        return new Response("Failed to get user for this application : " + error, { status: 500 });
    }
};