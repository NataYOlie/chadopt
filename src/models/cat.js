import { Schema, model, models } from "mongoose";

const CatSchema = new Schema({
    name: {
        type: String,
        required: [true, "Le nom du chat est obligatoire !"]
    },

    birthdate: {
        type: Date,
        required: [true, "La date de naissance du chat est obligatoire !"]
    },

    sex: {
        type: String,
        enum: ["male", "female"],
        required: [true, "Le sexe du chat est obligatoire !"]
    },

    breed: {
        type: String,
        enum: ["Balinais", "Siamois", "British long hair", "British short hair", "Main Coon", "Européen", "Angora"],
        default: "Européen", // Définition de la valeur par défaut à "european"
        required: true,
    },

    city: {
        type: String,
        required: [true, "La ville est obligatoire !"],
    },

    description: {
        type: String,
        required: [true, "La description est obligatoire !"],
    },

    photo: {
        type: String,
        required: [true, "La photo est obligatoire !"],
        default: "https://cataas.com/cat",
    },

    adoptionStatus: {
        type: String,
        enum: ["disponible", "demande en cours", "adopté"],
        default: "disponible", // Définition de la valeur par défaut à "available"
        required: true,
    },

    applications: [
        {
            type: Date,
            user: {
                type: Schema.Types.ObjectId,
                ref: "User",
            }
        }
    ],
});

const Cat = models.Cat || model("Cat", CatSchema);
export default Cat;