import {connectToDB} from "@/utils/database";
import User from "@/models/user";
import bcrypt from "bcrypt";


export const POST = async (req, res) => {

    const { username, password, role } = await req.json();
    console.log(username)
    console.log(password)

    try {
        await connectToDB();
        // Vérifiez si l'utilisateur existe déjà
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ error: "Cet utilisateur existe déjà." });
        }

        // Création du nouvel utilisateur avec encryption du mot de passe avec bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username: username,
            password : hashedPassword,
            role: role,
        });

        // Enregistrement du nouvel utilisateur dans la base de données
        await newUser.save();

        //status 201 signifie : created
        return new Response(JSON.stringify(newUser), { status: 201 })

    } catch (error) {
        //status 500 signifie : server error
        return new Response("Failed to create a new user : " + error, { status: 500 })
    }


//PATCH pour modifier un user
// export const PATCH = async (request) => {
//     const user = await request.json();
//     let patchUserVrai = new User(user);
//     console.log("patchUserVrai")
//     console.log(patchUserVrai)
//     console.log("user")
//     console.log(user)
//
//     try {
//         await connectToDB();
//         let patchUser = await User.findById(user._id);
//         if(!patchUser) return new Response("User not found ", { status: 404 })
//         console.log("patchUser")
//         console.log(patchUser)
//         // Extraire seulement le mot de passe
//         const { password } = patchUser;
//         console.log("password")
//         console.log(password)
//         // Mettre à jour la liste des favorites
//         patchUser = { ...patchUser, favorites: user.favorites}
//         const encoreUnUser = new User({patchUser});
//         // Enregistrement des modifications dans la base de données
//         await encoreUnUser.save();
//
//         console.log("API PATCH USER : " + patchUser);
//         return new Response(JSON.stringify(patchUser), { status:200 });
//
//     } catch (error) {
//         return new Response("Failed to patch user" + error, { status: 500 })
//     }




}