import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["folder", "file"],
      required: true,
    },
    name: {
      type: String,
      required: [true, "Note must have a name"],
      trim: true,
      maxlength: [100, "Name must be less than 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      enum: ["Colleges", "Courses", "Other"],
      default: "Other",
      // Category is typically used for root folders
    },
    parent: {
      type: mongoose.Schema.ObjectId,
      ref: "Note",
      default: null, // null means it's a root folder
    },
    description: {
      type: String,
      trim: true,
      required: [true, "Note must have an SEO description"],
      maxlength: [500, "Description must be less than 500 characters"],
    },
    keywords: {
      type: String,
      trim: true,
      required: [true, "Note must have SEO keywords"],
    },
    iframeUrl: {
      type: String,
      trim: true,
      // Only required/used if type is 'file'
    },
    viewsCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
);

// Pre-save hook to generate unique slug based on name and parent/id
noteSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    const s = this.name.split(" ").join("-").toLowerCase();
    const id = this._id;
    const u = `${s.substring(0, 40)}-${id.toString().substring(18)}`; // Add part of ID to ensure uniqueness
    const m = u.replace(/[^a-zA-Z0-9-]/g, "");
    this.slug = m;
  }
  next();
});

const Note = mongoose.models.Note || mongoose.model("Note", noteSchema);

export default Note;
