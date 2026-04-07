import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import cookieParser from "cookie-parser";

import dbConnect from "./config/databaseConfig.js";
import startExpireListingsJob from "./jobs/expireListingsJob.js";
import startDraftReminderJob from "./jobs/draftReminderJob.js";
import startDeleteExpiredRemovedListingsJob from "./jobs/deleteExpiredRemovedListingsJob.js";
import { initSocket } from "./socket/index.js";

import listingStatusRoutes from "./routes/listingStatusRoutes.js";
import listingRoutes from "./routes/listingRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import resetPasswordRoutes from "./routes/resetPasswordRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";
import locationListingRoutes from "./routes/locationListingRoutes.js";
import listingAppealRoutes from "./routes/listingAppealRoutes.js";
import supportRoutes from "./routes/supportRoutes.js";
import rejectedPaymentRoutes from "./routes/rejectedPaymentRoutes.js";
// app.js


// admin
import adminOverviewRoutes from "./routes/adminOverviewRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import adminPaymentRoutes from "./routes/adminPaymentRoutes.js";
import adminModerationRoutes from "./routes/adminModerationRoutes.js";
import adminAppealRoutes from "./routes/adminAppealRoutes.js";
import adminSupportRoutes from "./routes/adminSupportRoutes.js";

dbConnect();
startExpireListingsJob();
startDraftReminderJob();
startDeleteExpiredRemovedListingsJob();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/reset", resetPasswordRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/listings", listingStatusRoutes);
app.use("/api/v1/listings", listingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/chats", chatRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/favorites", favoriteRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/reports", reportRoutes);
app.use("/api/v1/listings", locationListingRoutes);
app.use("/api/v1/listings", listingAppealRoutes);
app.use("/api/v1/support", supportRoutes);
app.use("/api/v1/listings", rejectedPaymentRoutes);

// admin
app.use("/api/v1/admin", adminOverviewRoutes);
app.use("/api/v1/analytics", analyticsRoutes);
app.use("/api/v1/admin/auth", adminAuthRoutes);
app.use("/api/v1/admin", adminDashboardRoutes);
app.use("/api/v1/admin/payments", adminPaymentRoutes);
app.use("/api/v1/admin", adminModerationRoutes);
app.use("/api/v1/admin", adminAppealRoutes);
app.use("/api/v1/admin/support", adminSupportRoutes);

app.get("/api/v1/ping", (req, res) => {
  res.json({ message: "Backend connected" });
});

const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);
initSocket(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});









// when developing uncomment. 
// import path from "path";
// import dotenv from "dotenv";
// import express from "express";
// import cors from "cors";
// import helmet from "helmet";
// import { rateLimit } from "express-rate-limit";

// import dbConnect from "./config/databaseConfig.js";
// import startExpireListingsJob from "./jobs/expireListingsJob.js";
// import listingStatusRoutes from "./routes/listingStatusRoutes.js";
// import listingRoutes from "./routes/listingRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import profileRoutes from "./routes/profileRoutes.js";
// import chatRoutes from "./routes/chatRoutes.js";
// import resetPasswordRoutes from "./routes/resetPasswordRoutes.js";
// import reviewRoutes from "./routes/reviewRoutes.js";
// import paymentRoutes from "./routes/paymentRoutes.js";

// // admin
// import adminOverviewRoutes from "./routes/adminOverviewRoutes.js";
// import analyticsRoutes from "./routes/analyticsRoutes.js";
// import adminAuthRoutes from "./routes/adminAuthRoutes.js";
// import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
// import adminPaymentRoutes from "./routes/adminPaymentRoutes.js";

// dotenv.config();
// dbConnect();
// startExpireListingsJob();

// const app = express();
// const isProduction = process.env.NODE_ENV === "production";

// app.set("trust proxy", 1);

// app.disable("x-powered-by");

// if (isProduction) {
//   app.use(
//     helmet({
//       crossOriginResourcePolicy: { policy: "cross-origin" },
//       contentSecurityPolicy: false, // easier for API backend; enable later if needed
//       strictTransportSecurity: {
//         maxAge: 31536000,
//         includeSubDomains: true,
//         preload: false,
//       },
//       referrerPolicy: { policy: "no-referrer" },
//     })
//   );
// } else {
//   app.use(
//     helmet({
//       crossOriginResourcePolicy: { policy: "cross-origin" },
//       contentSecurityPolicy: false,
//       strictTransportSecurity: false,
//     })
//   );
// }

// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "http://localhost:3000",
//     credentials: true,
//   })
// );

// app.use(express.json({ limit: "10kb" }));
// app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// const rateLimitHandler = (req, res, next, options) => {
//   return res.status(options.statusCode).json({
//     success: false,
//     message: options.message || "Too many requests. Please try again later.",
//     retryAfter:
//       typeof req.rateLimit?.resetTime === "object"
//         ? Math.ceil((new Date(req.rateLimit.resetTime).getTime() - Date.now()) / 1000)
//         : undefined,
//   });
// };

// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: isProduction ? 200 : 1000,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
//   message: "Too many API requests from this IP. Please try again later.",
// });

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: isProduction ? 10 : 50,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
//   message: "Too many authentication attempts. Please try again later.",
// });

// const resetLimiter = rateLimit({
//   windowMs: 30 * 60 * 1000,
//   max: isProduction ? 5 : 20,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
//   message: "Too many password reset attempts. Please try again later.",
// });

// const chatLimiter = rateLimit({
//   windowMs: 60 * 1000,
//   max: isProduction ? 30 : 200,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
//   message: "Too many chat requests. Slow down and try again shortly.",
// });

// const uploadLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: isProduction ? 20 : 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
//   message: "Too many upload attempts. Please try again later.",
// });

// const paymentLimiter = rateLimit({
//   windowMs: 10 * 60 * 1000,
//   max: isProduction ? 20 : 100,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
//   message: "Too many payment requests. Please try again later.",
// });

// const adminAuthLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: isProduction ? 7 : 30,
//   standardHeaders: true,
//   legacyHeaders: false,
//   handler: rateLimitHandler,
//   message: "Too many admin login attempts. Please try again later.",
// });

// app.use("/api", apiLimiter);

// app.use("/uploads", express.static(path.join(process.cwd(), "public/uploads")));

// app.use("/api/auth", authLimiter);
// app.use("/api/reset", resetLimiter);
// app.use("/api/admin/auth", adminAuthLimiter);
// app.use("/api/chats", chatLimiter);
// app.use("/api/payments", paymentLimiter);

// app.use("/api/listings", uploadLimiter);

// app.use("/api/auth", authRoutes);
// app.use("/api/reset", resetPasswordRoutes);
// app.use("/api", profileRoutes);
// app.use("/api/listings", listingStatusRoutes);
// app.use("/api/listings", listingRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/chats", chatRoutes);
// app.use("/api/payments", paymentRoutes);

// // admin
// app.use("/api/admin", adminOverviewRoutes);
// app.use("/api/analytics", analyticsRoutes);
// app.use("/api/admin/auth", adminAuthRoutes);
// app.use("/api/admin", adminDashboardRoutes);
// app.use("/api/admin", adminPaymentRoutes);

// app.get("/api/ping", (req, res) => {
//   res.json({ message: "Backend connected" });
// });

// app.use((req, res) => {
//   res.status(404).json({
//     success: false,
//     message: "Route not found",
//   });
// });

// app.use((err, req, res, next) => {
//   console.error("SERVER ERROR:", err);

//   res.status(err.status || 500).json({
//     success: false,
//     message: isProduction
//       ? "Internal server error"
//       : err.message || "Internal server error",
//   });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));