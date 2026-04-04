// import jwt from "jsonwebtoken";

// export default function optionalAuth(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) return next();

//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded; 
//   } catch {
//   }
//   next();
// }



import jwt from "jsonwebtoken";

export default function optionalAuth(req, res, next) {
  const bearerHeader = req.headers.authorization;
  const bearerToken =
    bearerHeader && bearerHeader.startsWith("Bearer ")
      ? bearerHeader.split(" ")[1]
      : null;

  const cookieToken = req.cookies?.token;

  const token = bearerToken || cookieToken;

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch {
  }

  next();
}