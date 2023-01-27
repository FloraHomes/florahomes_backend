import Payment from "../models/paymentModel.js";
import { amountFormat, mailgun, recieptEmailTemplate, simpleDateString } from "../utils.js";
import pdf from "html-pdf"
import ejs from "ejs"
import fs from "fs"
import { getBaseUrl } from "../server.js";
import User from "../models/userModel.js";
import { goalByUserId } from "./goalController.js";

export const savePayment = async(amountPaid, purchasedUnit, price, referenceId, propertyId, userId, source, title, body) => {
  const newPayment = new Payment({
    amountPaid,
    purchasedUnit,
    price,
    referenceId,
    property: propertyId,
    user: userId,
    source
  });

  const paySummary = await Payment.aggregate([
    {
      $match: {
        user: userId
      }
    },
    {
      $group: {
        _id: null,
        prevUnits: { $sum: '$purchasedUnit' },

      },
    },
    
  ]);

  const payment = await newPayment.save();
  await payment.populate('property', 'name')
  const user = await User.findOne({_id: userId})
  const goal = await(goalByUserId(userId)) 

  let previousPurchase = paySummary[0]?.prevUnits ? paySummary[0]?.prevUnits : 0
  let tot = Number(purchasedUnit) + Number(previousPurchase)
  let remainder = goal[0]?.goalUnits - tot


  var recieptData = {
    recieptId: `FHGC-${payment?._id}`,
    amount: amountFormat(payment?.amountPaid),
    price: amountFormat(payment?.price),
    date: simpleDateString(payment?.createdAt),
    customerName: `${user?.firstName} ${user?.lastName}`,
    qty: amountFormat(purchasedUnit),
    price: amountFormat(price),
    prevPurchase: amountFormat(previousPurchase),
    totalPurchase: amountFormat(tot),
    property: payment?.property?.name,
    source: source,
    remainder

  }

  const recieptTemplate = getBaseUrl("template/reciept.html");
  var compiled = ejs.compile(fs.readFileSync(recieptTemplate, 'utf8'));
  var html = compiled(recieptData);
  // let html = fs.readFileSync(recieptTemplate, "utf8");


  // var options = {
  //   format: "A4",   
  //   orientation: "portrait",
  //   border: "10mm",
  //   childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}
  // };

  // var document = {
  //   html: html,
  //   data: {
  //     recieptData,
  //   },
  //   path: `./attachment/${payment?._id}.pdf`,
  //   type: "",
  // };

  const filePath = getBaseUrl(`attachment/${payment?._id}.pdf`)

  console.log(filePath?.pathname.substring(1));

  pdf.create(html, {childProcessOptions: { env: { OPENSSL_CONF: '/dev/null' }}}).toFile(filePath?.pathname.substring(1), () => {
    console.log('pdf done')
    mailgun()
    .messages()
    .send(
      {
        from: 'Florahomes <admin@florahomesgc.com>',
        to: `${recieptData?.customerName} <${user.email}>`,
        subject: title,
        html: recieptEmailTemplate(recieptData?.customerName, body),
        attachment: filePath?.pathname.substring(1)
      },
      (error, body) => {
        if (error) {
          console.log(error);
        } else {
          console.log(body);
          fs.unlink(filePath?.pathname.substring(1), (err) => {
            if (err) {
              console.log(err);
                // throw err;
            }
        
            console.log("Delete File successfully.");
        });
        }
      }
    );
})

  // pdf
  // .create(document, options, )
  // .then((res) => {
  //   const filePath = getBaseUrl(`attachment/${payment?._id}.pdf`)

  //   mailgun()
  //   .messages()
  //   .send(
  //     {
  //       from: 'Florahomes <admin@florahomes.com>',
  //       to: `${recieptData?.customerName} <${user.email}>`,
  //       subject: `Successful Payment`,
  //       html: recieptEmailTemplate(recieptData?.customerName),
  //       attachment: filePath?.pathname.substring(1)
  //     },
  //     (error, body) => {
  //       if (error) {
  //         console.log(error);
  //       } else {
  //         console.log(body);
  //         fs.unlink(`./attachment/${payment?._id}.pdf`, (err) => {
  //           if (err) {
  //             console.log(err);
  //               // throw err;
  //           }
        
  //           console.log("Delete File successfully.");
  //       });
  //       }
  //     }
  //   );
 
  // })
  // .catch((error) => {
  //   console.error(error);
  // });

 
  return payment
}

export const paymentById = async(userId) => {
  const payments = await Payment.find({ user: userId }).sort({createdAt:-1}).populate('property', 'name');
  return payments
}


