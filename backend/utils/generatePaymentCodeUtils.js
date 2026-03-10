export default function generatePaymentCode() {

  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "P2P-";
  for (let i = 0; i < 6; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}