import Listing from "../models/listingModels.js";
import Payment from "../models/paymentModel.js";
import Report from "../models/reportModel.js";
import Support from "../models/supportMessageModel.js";
import userModel from "../models/userModel.js";
import {
  emitAdminBadgesUpdated,
  emitAdminOverviewUpdated,
} from "./realtimeService.js";

export const getAdminSnapshotData = async () => {
  const now = new Date();

  const [
    totalUsers,
    pendingPayments,
    openReports,
    pendingAppeals,
    publishedListings,
    openSupport,
  ] = await Promise.all([
    userModel.countDocuments(),
    Payment.countDocuments({ status: "PENDING_CONFIRMATION" }),
    Report.countDocuments({ status: "OPEN" }),
    Listing.countDocuments({
      publishStatus: "APPEAL_PENDING",
      appealStatus: "PENDING",
    }),
    Listing.countDocuments({
      publishStatus: "PUBLISHED",
      expiresAt: { $gt: now },
    }),
    Support.countDocuments({
      status: { $in: ["NEW", "IN_PROGRESS"] },
    }),
  ]);

  return {
    totalUsers,
    pendingPayments,
    openReports,
    pendingAppeals,
    publishedListings,
    openSupport,
    updatedAt: new Date().toISOString(),
  };
};

export const emitAdminSnapshot = async () => {
  const snapshot = await getAdminSnapshotData();

  emitAdminOverviewUpdated({
    totalUsers: snapshot.totalUsers,
    pendingPayments: snapshot.pendingPayments,
    openReports: snapshot.openReports,
    pendingAppeals: snapshot.pendingAppeals,
    publishedListings: snapshot.publishedListings,
    updatedAt: snapshot.updatedAt,
  });

  emitAdminBadgesUpdated({
    dashboard:
      snapshot.pendingPayments +
      snapshot.openReports +
      snapshot.pendingAppeals +
      snapshot.openSupport,
    payments: snapshot.pendingPayments,
    reports: snapshot.openReports,
    appeals: snapshot.pendingAppeals,
    support: snapshot.openSupport,
    users: snapshot.totalUsers,
    performance: 0,
    updatedAt: snapshot.updatedAt,
  });
};