import { Schema, model, models } from "mongoose";

    const UserSchema = new Schema({
        username: {
          type: String,
          required: [true, "Le nom d'utilisateur est requis"]
        },

        password: {
            type: String,
            required: true,
        },

        role : {
            type:String,
            enum: ["admin", "user"],
            default: "user",
            required:true,
        },

        favorites: [
                {
                type: Schema.Types.ObjectId,
                ref: "Cat"
                }
            ]
      });




const User = models.User || model("User", UserSchema);
export default User;

