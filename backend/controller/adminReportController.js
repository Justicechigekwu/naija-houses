import Report from "../models/reportModel.js";
import { emitAdminReportsUpdated } from "../service/realtimeService.js";
import { emitAdminSnapshot } from "../service/adminRealtimeService.js";

export const getAllReports = async (req, res) => {
  try {
    const { status, targetType } = req.query;

    const filter = {};

    if (status) filter.status = status;
    if (targetType) filter.targetType = targetType;

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .populate("reportedBy", "firstName lastName email")
      .populate("targetUser", "firstName lastName email avatar")
      .populate("targetListing", "title category subcategory publishStatus owner appealStatus")
      .populate("reviewedBy", "email");

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to load reports" });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminNote } = req.body;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    report.status = status || report.status;
    report.adminNote = adminNote ?? report.adminNote;
    report.reviewedBy = req.admin.id;
    report.reviewedAt = new Date();

    await report.save();

    res.json({
      message: "Report updated successfully",
      report,
    });

    emitAdminReportsUpdated({
      reportId: report._id,
      status: report.status,
      updatedAt: new Date().toISOString(),
    });

    await emitAdminSnapshot();
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to update report" });
  }
};

export const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    await report.deleteOne();

        emitAdminReportsUpdated({
      reportId: report._id,
      status: report.status,
      updatedAt: new Date().toISOString(),
    });
    
    await emitAdminSnapshot();

    res.json({ message: "Report cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to clear report" });
  }
};

export const deleteResolvedReports = async (req, res) => {
  try {
    const { mode } = req.query;

    if (mode === "all") {
      const result = await Report.deleteMany({});

      emitAdminReportsUpdated({
        type: "REPORTS_BULK_CLEARED",
        mode: "all",
        updatedAt: new Date().toISOString(),
      });

      await emitAdminSnapshot();

      return res.json({
        message: "All reports cleared successfully",
        deletedCount: result.deletedCount || 0,
      });
    }

    const result = await Report.deleteMany({
      status: { $in: ["RESOLVED", "DISMISSED"] },
    });

    emitAdminReportsUpdated({
      type: "REPORTS_BULK_CLEARED",
      mode: "handled",
      updatedAt: new Date().toISOString(),
    });

    await emitAdminSnapshot();

    res.json({
      message: "Handled reports cleared successfully",
      deletedCount: result.deletedCount || 0,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message || "Failed to clear reports",
    });
  }
};