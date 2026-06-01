import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    referrer: { type: String, default: "" },
    country: { type: String, default: "India" },
    countryCode: { type: String, default: "IN" },
    city: { type: String, default: "" },
    device: { type: String, default: "desktop" }, // desktop, mobile, tablet
    browser: { type: String, default: "" },
    os: { type: String, default: "" },
    ip: { type: String, default: "" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

const Visit = mongoose.models.Visit || mongoose.model("Visit", visitSchema);
export default Visit;
