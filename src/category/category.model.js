import { Schema, model } from "mongoose";

const categorySchema = Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },
    description:{
        type: String,
        required: [true, "Description is required"],
        maxLength: [100, "Description cannot exceed 100 characters"]
    },
    typeCategory:{
        type: String,
        required: true,
        enum: ["OTHER_CATEGORY", "FOOD_CATEGORY", "HOME_CATEGORY", "CLOTHES_CATEGORY", "CLEANING_CATEGORY", 
            "TOY_CATEGORY", "ELECTRONIC_CATEGORY", "PET_CATEGORY", "SPORT_CATEGORY", "MUSIC_CATEGORY",
            "VIDEOGAME_CATEGORY", "FASHION_CATEGORY", "ACCESSORIES_CATEGORIA", "FURNITURE_CATEGORY"],
        default: "OTHER_CATEGORY"
    },
    status:{
        type: Boolean,
        default: true
    }
},
{
    versionKey: false,
    timeStamps: true
})

export default model("Category", categorySchema)