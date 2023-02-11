import mongoose from "mongoose"

const propertyCategorySchema = new mongoose.Schema(
    {
        name: {type: String, required: true},

    },
    {
        timestamps: true
    }
)

const PropertyCategory = mongoose.model('PropertyCategory', propertyCategorySchema)
export default PropertyCategory