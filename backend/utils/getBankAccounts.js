// export default function getBankAccounts() {
//   try {
//     const raw = process.env.ADMIN_BANK_ACCOUNTS;
//     if (!raw) return [];

//     const parsed = JSON.parse(raw);

//     if (!Array.isArray(parsed)) return [];

//     return parsed.filter(
//       (item) =>
//         item &&
//         typeof item.bankName === "string" &&
//         typeof item.accountName === "string" &&
//         typeof item.accountNumber === "string"
//     );
//   } catch (error) {
//     console.error("Invalid ADMIN_BANK_ACCOUNTS:", error.message);
//     return [];
//   }
// }

export default function getBankAccounts() {
  try {
    const raw = process.env.ADMIN_BANK_ACCOUNTS;
    console.log("RAW ADMIN_BANK_ACCOUNTS:", raw);

    if (!raw) return [];

    const parsed = JSON.parse(raw);
    console.log("PARSED BANK ACCOUNTS:", parsed);

    if (!Array.isArray(parsed)) return [];

    return parsed.filter(
      (item) =>
        item &&
        typeof item.bankName === "string" &&
        typeof item.accountName === "string" &&
        typeof item.accountNumber === "string"
    );
  } catch (error) {
    console.error("Invalid ADMIN_BANK_ACCOUNTS:", error.message);
    return [];
  }
}