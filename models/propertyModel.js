import mongoose from "mongoose"

const propertySchema = new mongoose.Schema( 
    {
        name: {type: String, required: true},
        photo: {type: String, required: true},
        currentPricePerUnit: {type: String, required: false},
        title: {type: String, required: true},
        content: {type: String, required: true},
        propertyCategory: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyCategory", required: true },
        propertyType: { type: mongoose.Schema.Types.ObjectId, ref: "PropertyType", required: true },
        planNumber: {type: String, required: false},
        faq: { type: Array, required: false },
        area: {type: String, required: true},
        unitsPerPlot: {type: String, required: false},
        coverPhoto: {type: String, required: true},
        otherPhotos: { type: Array, required: false },
        isActive: {type: Boolean, default: true, required: false},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    },
    {
        timestamps: true
    }
)

const Property = mongoose.model('Property', propertySchema)
export default Property