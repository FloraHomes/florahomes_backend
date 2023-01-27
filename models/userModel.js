import mongoose from "mongoose"

const userSchema = new mongoose.Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        phone: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        role: {type: String, default: "ownEarner", required: false},
        onboardingLevel: {type: String, required: false},
        address: {type: String, required: false},
        photoUrl: {type: String, required: false},
        idUploadUrl: {type: String, required: false},
        signatureUrl: {type: String, required: false},
        dob: {type: String, required: false},
        gender: {type: String, required: false},
        accountName: {type: String, required: false},
        bankName: {type: String, required: false},
        accountNo: {type: String, required: false},
        permanentAddress: {type: String, required: false},
        occupation: {type: String, required: false},
        workAddress: {type: String, required: false},
        maritalStatus: {type: String, required: false},
        nokName: {type: String, required: false},
        nokPhone: {type: String, required: false},
        nokAddress: {type: String, required: false},
        rNok: {type: String, required: false},
        property: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Property',
            required: false,
        },
        // propertyId: {type: String, required: false}, 
    },
    {
        timestamps: true
    }
)

const User = mongoose.model('User', userSchema)
export default User