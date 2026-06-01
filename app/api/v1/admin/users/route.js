import { NextResponse } from "next/server";
import connectMongoDB from "@/app/_lib/mongodb";
import User from "@/app/_models/userModel";
import { auth } from "@/app/_lib/auth";

// GET: Retrieve list of users with search, role, and verification filters, plus pagination
export async function GET(request) {
  try {
    await connectMongoDB();

    // 1. Authorize - must be logged in admin
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await User.findOne({ email: session.user.email }).lean();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Parse query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "all";
    const verified = searchParams.get("verified") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    // 3. Build query filter
    const filter = {};

    // Search filter (searches name, email, or username)
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } }
      ];
    }

    // Role filter
    if (role !== "all") {
      filter.role = role;
    }

    // Verification status filter
    if (verified !== "all") {
      filter.verified = verified === "true";
    }

    // 4. Retrieve data and count total matches
    const totalUsers = await User.countDocuments(filter);
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await User.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          totalPages,
          totalUsers
        }
      }
    });

  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// PUT: Update a user's details (role, verified, status, xp, level, badge)
export async function PUT(request) {
  try {
    await connectMongoDB();

    // 1. Authorize - must be logged in admin
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await User.findOne({ email: session.user.email }).lean();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Parse request body
    const body = await request.json();
    const { userId, role, verified, status, xp, level, badge } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // 3. Find user and update fields
    const userToUpdate = await User.findById(userId);
    if (!userToUpdate) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update fields if provided in request
    if (role !== undefined) userToUpdate.role = role;
    if (verified !== undefined) userToUpdate.verified = verified;
    if (status !== undefined) userToUpdate.status = status;
    if (xp !== undefined) userToUpdate.xp = parseInt(xp, 10) || 0;
    if (level !== undefined) userToUpdate.level = parseInt(level, 10) || 1;
    if (badge !== undefined) userToUpdate.badge = badge;

    await userToUpdate.save();

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: {
        id: userToUpdate._id,
        name: userToUpdate.name,
        role: userToUpdate.role,
        verified: userToUpdate.verified
      }
    });

  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Permanently delete a user record from database
export async function DELETE(request) {
  try {
    await connectMongoDB();

    // 1. Authorize - must be logged in admin
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminUser = await User.findOne({ email: session.user.email }).lean();
    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Parse User ID from query
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    // Prevent deleting oneself
    if (userId === adminUser._id.toString()) {
      return NextResponse.json({ error: "You cannot delete your own admin account" }, { status: 400 });
    }

    // 3. Delete user
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return NextResponse.json({ error: "User not found or already deleted" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "User permanently deleted successfully"
    });

  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
