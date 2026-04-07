import Support from "../models/supportMessageModel.js";
import sendEmail from "../utils/sendEmailsUtils.js";

const normalizeEmail = (value = "") => String(value).trim().toLowerCase();

export const createSupportMessage = async (req, res) => {
  try {
    const { fullName, email, phone, address, reason, message } = req.body;

    if (!fullName?.trim()) {
      return res.status(400).json({ message: "Full name is required" });
    }

    if (!email?.trim()) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!reason?.trim()) {
      return res.status(400).json({ message: "Reason is required" });
    }

    if (!message?.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const normalizedEmail = normalizeEmail(email);

    const supportMessage = await Support.create({
      fullName: fullName.trim(),
      email: normalizedEmail,
      phone: phone?.trim() || "",
      address: address?.trim() || "",
      reason: reason.trim(),
      message: message.trim(),
      user: req.user?.id || null,
    });

    if (process.env.SUPPORT_ADMIN_EMAIL) {
      try {
        await sendEmail({
          to: process.env.SUPPORT_ADMIN_EMAIL,
          subject: `New Velora support request: ${supportMessage.reason}`,
          replyTo: normalizedEmail,
          text: `
New support request received on Velora.

Name: ${supportMessage.fullName}
Email: ${supportMessage.email}
Phone: ${supportMessage.phone || "-"}
Address: ${supportMessage.address || "-"}
Reason: ${supportMessage.reason}

Message:
${supportMessage.message}
          `.trim(),
          html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
              <h2>New Velora support request</h2>
              <p><strong>Name:</strong> ${supportMessage.fullName}</p>
              <p><strong>Email:</strong> ${supportMessage.email}</p>
              <p><strong>Phone:</strong> ${supportMessage.phone || "-"}</p>
              <p><strong>Address:</strong> ${supportMessage.address || "-"}</p>
              <p><strong>Reason:</strong> ${supportMessage.reason}</p>
              <p><strong>Message:</strong></p>
              <div style="padding:12px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa;">
                ${supportMessage.message.replace(/\n/g, "<br />")}
              </div>
            </div>
          `,
        });
      } catch (mailError) {
        console.error("Support email notification failed:", mailError);
      }
    }

    return res.status(201).json({
      message:
        "Your support message has been sent successfully. Velora support will get back to you through your email.",
      supportMessage,
    });
  } catch (error) {
    console.error("createSupportMessage error:", error);
    return res.status(500).json({
      message: error.message || "Failed to send support message",
    });
  }
};

export const getAdminSupportMessages = async (req, res) => {
  try {
    const { status } = req.query;

    const filter = {};
    if (status) filter.status = status;

    const messages = await Support.find(filter)
      .sort({ createdAt: -1 })
      .populate("user", "firstName lastName email avatar");

    return res.json(messages);
  } catch (error) {
    console.error("getAdminSupportMessages error:", error);
    return res.status(500).json({
      message: error.message || "Failed to load support messages",
    });
  }
};

export const getAdminSupportMessageDetails = async (req, res) => {
  try {
    const { supportId } = req.params;

    const message = await Support.findById(supportId).populate(
      "user",
      "firstName lastName email avatar"
    );

    if (!message) {
      return res.status(404).json({ message: "Support message not found" });
    }

    if (!message.readAt) {
      message.readAt = new Date();
      await message.save();
    }

    return res.json(message);
  } catch (error) {
    console.error("getAdminSupportMessageDetails error:", error);
    return res.status(500).json({
      message: error.message || "Failed to load support message details",
    });
  }
};

export const updateSupportMessageStatus = async (req, res) => {
  try {
    const { supportId } = req.params;
    const { status, adminReplyNote } = req.body;

    const supportMessage = await Support.findById(supportId);

    if (!supportMessage) {
      return res.status(404).json({ message: "Support message not found" });
    }

    if (status) {
      supportMessage.status = status;
    }

    if (typeof adminReplyNote === "string") {
      supportMessage.adminReplyNote = adminReplyNote.trim();
    }

    if (status === "RESOLVED" && !supportMessage.repliedAt) {
      supportMessage.repliedAt = new Date();
    }

    await supportMessage.save();

    return res.json({
      message: "Support message updated successfully",
      supportMessage,
    });
  } catch (error) {
    console.error("updateSupportMessageStatus error:", error);
    return res.status(500).json({
      message: error.message || "Failed to update support message",
    });
  }
}; 