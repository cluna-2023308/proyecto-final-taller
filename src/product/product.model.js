import { Schema, model } from "mongoose";

const productSchema = Schema({
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
    stock:{
        type: Number,
        required: true,
        default: 0
    },
    price:{
        type: Number, 
        required: true,
        default: 0.00
    },
    category: {
        type: Schema.ObjectId,
        ref: 'Category',
        required: true,
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

export default model("Product", productSchema)