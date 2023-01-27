import express from "express";
import expressAsyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { generateToken, isAuth } from "../utils.js";

const userRoutes = express.Router();

userRoutes.post(
  "/signin",
  expressAsyncHandler(async (req, res) => {
    console.log(req);
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          status: true,
          data: {
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user?.phone,
            role: user.role,
            address: user.address,
            onboardingLevel: user?.onboardingLevel,
            photoUrl: user?.photoUrl,
            signatureUrl: user?.signatureUrl,
            property: user?.property,
            token: generateToken(user),
          },
          message: "Authentication Successful",
        });
        return;
      }
    }

    res
      .status(401)
      .send({ status: false, message: "Invalid email or password" });
  })
);

userRoutes.post(
  "/signup",
  expressAsyncHandler(async (req, res) => {
    const newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req?.body?.phone,
      role: req?.body?.role,
      isComplete: req?.body?.isComplete,
      onboardingLevel: "signUp",
      password: bcrypt.hashSync(req.body.password),
    });

    const user = await newUser.save();

    res.send({
      status: true,
      data: {
        _id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user?.phone,
        role: user.role,
        address: user.address,
        onboardingLevel: user?.onboardingLevel,
        photoUrl: user?.photoUrl,
        signatureUrl: user?.signatureUrl,
        property: user?.property,
        token: generateToken(user),
      },
      message: "Authentication Successful",
    });
  })
);

userRoutes.put(
  "/update",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.firstName = req.body?.firstName || user.firstName;
      user.lastName = req.body?.lastName || user?.lastName;
      user.email = req.body?.email || user?.email;
      user.role = req.body?.role || user?.role;
      user.phone = req.body?.phone || user?.phone;
      user.address = req.body?.address || user?.address;
      user.property = req?.body?.propertyId || user?.property;
      user.onboardingLevel = req?.body?.onboardingLevel;
      user.idUploadUrl = req.body?.idUploadUrl || user?.idUploadUrl;
      user.photoUrl = req.body?.photoUrl || user?.photoUrl;
      user.signatureUrl = req.body?.signatureUrl || user?.signatureUrl;
      user.dob = req.body?.dob || user?.dob;
      user.gender = req.body?.gender || user?.gender;
      user.accountName = req.body?.gender || user?.accountName;
      user.bankName = req.body?.bankName || user?.bankName;
      user.accountNo = req.body?.accountNo || user?.accountNo;
      user.permanentAddress = req.body?.permanentAddress || user?.permanentAddress;
      user.occupation = req.body?.occupation || user?.occupation;
      user.workAddress = req.body?.workAddress || user?.workAddress;
      user.maritalStatus = req.body?.maritalStatus || user?.maritalStatus;
      user.nokName = req.body?.nokName || user?.nokName;
      user.nokPhone = req.body?.nokPhone || user?.nokPhone;
      user.nokAddress = req.body?.nokAddress || user?.nokAddress;
      user.rNok = req.body?.rNok || user?.rNok;
      const updatedUser = await user.save();
      res.send({
        status: true,
        data: {
          _id: updatedUser.id,
          firstName: updatedUser.firstName,
          lastName: updatedUser.lastName,
          email: updatedUser.email,
          phone: updatedUser?.phone,
          role: updatedUser.role,
          address: updatedUser.address,
          onboardingLevel: updatedUser?.onboardingLevel,
          photoUrl: updatedUser?.photoUrl,
          signatureUrl: updatedUser?.signatureUrl,
          property: updatedUser?.property,
          // token: generateToken(updatedUser),
        },
        message: "Update Successful",
      });
    } else {
      res.status(404).send({ status: false, message: "User Not Found" });
    }
  })
);

export default userRoutes;
