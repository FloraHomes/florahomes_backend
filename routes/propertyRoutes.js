import express from "express";
import expressAsyncHandler from "express-async-handler";
import Property from "../models/propertyModel.js";
import { isAdmin, isAuth } from "../utils.js";

const propertyRoutes = express.Router();

propertyRoutes.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const properties = await Property.find().sort({createdAt:-1}).populate('propertyCategory', 'name');
    res.send({
      status: true,
      message: "Properties fetch sucessfully",
      data: properties,
    });
  })
);

propertyRoutes.get(
  "/:id",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const property = await Property.findById(req.params.id);
    if (property) {
      res.send(property);
    } else {
      res.status(404).send({ message: "property Not Found" });
    }
  })
);

propertyRoutes.post(
  "/save",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const {name, photo, currentPricePerUnit, caption, title, content, propertyCategory, propertyType, planNumber, faq, area, unitsPerPlot, coverPhoto, otherPhotos} = req.body
    const newProperty = new Property({name, photo, currentPricePerUnit, title, caption, content, propertyCategory, propertyType, planNumber, faq, area, unitsPerPlot, coverPhoto, otherPhotos, user: req.user._id});


    try {
      const property = await newProperty.save();
      res.status(200).send({status:true, message: "property saved", data: property});
    }catch(error){
      res.status(301).send({status:false, message: "property not recorded", data: error});

    }    
  })
);





export default propertyRoutes;
