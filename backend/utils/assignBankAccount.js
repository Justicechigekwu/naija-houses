import Payment from "../models/paymentModel.js";
import getBankAccounts from "./getBankAccounts.js";

export default async function assignBankAccount() {
  const accounts = getBankAccounts();

  if (!accounts.length) {
    throw new Error("No bank accounts configured");
  }

  const totalPayments = await Payment.countDocuments();
  const selected = accounts[totalPayments % accounts.length];

  return selected;
}