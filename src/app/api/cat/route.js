import { connectToDB } from "/src/utils/database";
import Cat from "/src/models/cat";
import Application from "/src/models/application";

/**
 * Fetches all cats from the database
 * @param request
 * @returns {Promise<Response>}
 */
export const GET = async (request) => {

    try {
        await connectToDB();
        const cats = await Cat.find({}).populate("applications");
        console.log("API GET CATS : " + cats.length);
        return new Response(JSON.stringify(cats), { status:200 });

    } catch (error) {
        return new Response("Failed to fetch the cats " + error, { status: 500 })
    }
}

export const getAvailableCats = async (request) => {

    try {
        await connectToDB();

        const cats = await Cat.find({status: "disponible"});
        console.log("API GET AVAILABLE CATS : " + cats.length);

        return new Response(JSON.stringify(cats), { status:200 });

    } catch (error) {
        return new Response("Failed to fetch available cats " + error, { status: 500 })
    }
}

export const getCatsByCity = async (request, city) => {

    try {
        await connectToDB();

        const cat = await Cat.find({ city: city});
        if(!cat) return new Response("Cat not found", { status: 404 })

        console.log("API GET CAT BY CITY ");

        return new Response(JSON.stringify(cat), { status:200 });

    } catch (error) {
        return new Response("Failed to fetch the cats by city " + error, { status: 500 })
    }
}