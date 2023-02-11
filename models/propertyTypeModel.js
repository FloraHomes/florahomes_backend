import mongoose from "mongoose"

const propertyTypeSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},

    },
    {
        timestamps: true
    }
)

const PropertyType = mongoose.model('PropertyType', propertyTypeSchema)
export default PropertyType