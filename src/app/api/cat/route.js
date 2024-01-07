import { connectToDB } from "/src/utils/database";
import Cat from "/src/models/cat";
import Application from "/src/models/application";

/**
 * Fetches all cats from the database
 */
export const GET = async (request) => {

    try {
        await connectToDB();
        const cats = await Cat.find({}).populate("applications");
        return new Response(JSON.stringify(cats), { status:200 });

    } catch (error) {
        return new Response("Failed to fetch the cats " + error, { status: 500 })
    }
}
