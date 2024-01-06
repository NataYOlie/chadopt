import { Schema, model, models } from "mongoose";

const ApplicationSchema = new Schema({
    applicationDate: {
        type: Date,
        default: Date.now
    },

    applicationStatus: {
        type: String,
        enum: ["Acceptée", "En attente", "Rejetée"],
        default: "En attente"
    }
})

const Application = model("Application", ApplicationSchema);
export default Application;