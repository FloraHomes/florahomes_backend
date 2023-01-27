import Withdrawal from "../models/withdrawalModel.js";

export const withdrawalByUserId = async (userId) => {
    const withdrawals = await Withdrawal.find({ user: userId }).sort({createdAt:-1});
   return withdrawals
};


export const logWithdrawal = async(amount, comment, paymentDate, user) => {

    const withrawal = new Withdrawal({
        amount, comment, paymentDate, user
    })
    const result = await withrawal.save();
    return result
  
  };


