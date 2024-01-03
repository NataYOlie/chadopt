import { connectToDB } from "/src/utils/database";
import Cat from "/src/models/cat";

export const POST = async (req, res) => {
    const cat = await req.json();

    try {
        console.log(cat)
        await connectToDB();
        const newCat = new Cat(cat)
        await newCat.save();

        //status 201 signifie : created
        return new Response(JSON.stringify(newCat), { status: 201 })

    } catch (error) {
        //status 500 signifie : server error
        return new Response("Failed to create a new cat" + error, { status: 500 })
    }
}