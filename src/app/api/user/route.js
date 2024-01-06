



//PATCH pour modifier un user ! Seulement les favorites
export const PATCH = async (request) => {
    try {
        const { _id, favorites } = await request.json();
        await connectToDB();
        const user = await User.findById(_id);
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

