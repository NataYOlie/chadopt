import mongoose, { Schema, model, models } from "mongoose";

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

delete mongoose.connection.models['Application'];
const Application = model("Application", ApplicationSchema);
console.log("Application model registered:", Application);
export default Application;