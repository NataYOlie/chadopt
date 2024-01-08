import {connectToDB} from "@/utils/database";
import User from "@/models/user";
import bcrypt from "bcrypt";


export const POST = async (req, res) => {

    const { username, password, role } = await req.json();

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
}