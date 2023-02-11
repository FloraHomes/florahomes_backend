import express from "express"
import { properties, propertyCategories, propertyTypes, users } from "../mock/data.js";
import PropertyCategory from "../models/propertyCategoryModel.js";
import Property from "../models/propertyModel.js";
import PropertyType from "../models/propertyTypeModel.js";
import User from "../models/userModel.js";

const seedRoutes = express.Router();

seedRoutes.get('/users', async(req, res) => {

    await User.remove({})
    const createdUsers = await User.insertMany(users)

    res.send({createdUsers})
})

seedRoutes.get('/properties', async(req, res) => {

    await Property.remove({})
    // const createdProperties = await Property.insertMany(properties)

    // res.send({createdProperties})
})

seedRoutes.get('/propertyTypes', async(req, res) => {

    await PropertyType.remove({})
    const createdPropertyTypes = await PropertyType.insertMany(propertyTypes)

    res.send({createdPropertyTypes})
})

seedRoutes.get('/propertyCategories', async(req, res) => {

    await PropertyCategory.remove({})
    const createdPropertyCategories = await PropertyCategory.insertMany(propertyCategories)

    res.send({createdPropertyCategories})
})


export default seedRoutes