export default function getBankAccounts() {
  try {
    const raw = process.env.ADMIN_BANK_ACCOUNTS;
    if (!raw) return [];

    const parsed = JSON.parse(raw);

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

