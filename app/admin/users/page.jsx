"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, 
  Search, 
  Edit2, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Filter, 
  X,
  Award,
  Sparkles,
  TrendingUp,
  User as UserIcon
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

export default function AdminUsersPage() {
  // Query Filters State
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [verifiedFilter, setVerifiedFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  
  // Data State
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
    totalUsers: 0
  });

  // Modal Control State
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Edit Form Fields State
  const [editRole, setEditRole] = useState("user");
  const [editVerified, setEditVerified] = useState(false);
  const [editStatus, setEditStatus] = useState("");
  const [editXp, setEditXp] = useState(0);
  const [editLevel, setEditLevel] = useState(1);
  const [editBadge, setEditBadge] = useState("");

  // Fetch Users List
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const url = `/api/v1/admin/users?search=${encodeURIComponent(search)}&role=${roleFilter}&verified=${verifiedFilter}&page=${page}&limit=${limit}`;
      const res = await axios.get(url);
      if (res.data.success) {
        setUsers(res.data.data.users);
        setPagination(res.data.data.pagination);
      } else {
        toast.error("Failed to load users database");
      }
    } catch (err) {
      console.error("Error loading users:", err);
      toast.error(err.response?.data?.error || "Error retrieving users from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, verifiedFilter, page]);

  // Trigger search
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setVerifiedFilter("all");
    setPage(1);
    // Directly trigger fetch after clearing state
    setTimeout(fetchUsers, 50);
  };

  // Open Edit Modal
  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditRole(user.role || "user");
    setEditVerified(user.verified || false);
    setEditStatus(user.status || "");
    setEditXp(user.xp || 0);
    setEditLevel(user.level || 1);
    setEditBadge(user.badge || "");
    setIsEditOpen(true);
  };

  // Submit Edit Form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await axios.put("/api/v1/admin/users", {
        userId: selectedUser._id,
        role: editRole,
        verified: editVerified,
        status: editStatus,
        xp: editXp,
        level: editLevel,
        badge: editBadge
      });

      if (res.data.success) {
        toast.success(`Updated settings for ${selectedUser.name}`);
        setIsEditOpen(false);
        fetchUsers();
      } else {
        toast.error("Failed to update user settings");
      }
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error(err.response?.data?.error || "Error applying changes");
    } finally {
      setSubmitting(false);
    }
  };

  // Open Delete Dialog
  const openDeleteModal = (user) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // Confirm Delete Action
  const handleDeleteConfirm = async () => {
    setSubmitting(true);
    try {
      const res = await axios.delete(`/api/v1/admin/users?userId=${selectedUser._id}`);
      if (res.data.success) {
        toast.success(`Permanently deleted user: ${selectedUser.name}`);
        setIsDeleteOpen(false);
        setPage(1);
        fetchUsers();
      } else {
        toast.error("Failed to delete user record");
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error(err.response?.data?.error || "Error deleting user from system");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex-1 space-y-6 pb-12 text-stone-850">
      {/* 1. Header Area */}
      <div className="border-b border-stone-200 pb-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900 flex items-center gap-2.5">
            <Users size={24} className="text-stone-700" />
            User Management
          </h1>
          <p className="text-sm text-stone-500 mt-1">Review accounts, adjust roles, verify creators, or manage statuses.</p>
        </div>
      </div>

      {/* 2. Filters & Searches */}
      <div className="bg-white p-4 border border-stone-200 rounded-xl shadow-xs flex flex-col lg:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative w-full lg:max-w-md flex items-center gap-2">
          <div className="relative flex-1">
            <input 
              type="text" 
              placeholder="Search by Name, Email, or Username..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-2.5 pl-9 border border-stone-200 rounded-lg text-sm bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-950 text-stone-850"
            />
            <Search size={16} className="absolute left-3 top-3.5 text-stone-400" />
          </div>
          <button 
            type="submit" 
            className="p-2.5 px-4 text-sm font-semibold rounded-lg bg-stone-900 text-white hover:bg-stone-800 transition"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
          {/* Role filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Role</span>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="p-2.5 text-xs font-semibold border border-stone-200 rounded-lg bg-stone-50 text-stone-700"
            >
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="guide">Guide</option>
              <option value="admin">Admin</option>
              <option value="note-manager">Note Manager</option>
            </select>
          </div>

          {/* Verification filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Status</span>
            <select
              value={verifiedFilter}
              onChange={(e) => { setVerifiedFilter(e.target.value); setPage(1); }}
              className="p-2.5 text-xs font-semibold border border-stone-200 rounded-lg bg-stone-50 text-stone-700"
            >
              <option value="all">All Accounts</option>
              <option value="true">Verified Only</option>
              <option value="false">Unverified Only</option>
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="p-2.5 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <X size={14} />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* 3. Table Database Board */}
      <div className="bg-white border border-stone-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="size-8 border-4 border-stone-200 border-t-stone-900 rounded-full animate-spin" />
            <p className="text-sm font-medium text-stone-500">Retrieving user files...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400 bg-stone-50/50">
                    <th className="p-4 py-3">Account Details</th>
                    <th className="p-4 py-3">Username</th>
                    <th className="p-4 py-3">Role</th>
                    <th className="p-4 py-3">Verification</th>
                    <th className="p-4 py-3 text-right">Activity Points</th>
                    <th className="p-4 py-3">Badge & Level</th>
                    <th className="p-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-xs font-medium text-stone-600">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-stone-50/50 transition">
                      {/* Details */}
                      <td className="p-4 py-3.5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Avatar className="size-9 border">
                            <AvatarImage src={user.photo} alt={user.name} className="object-cover" />
                            <AvatarFallback className="font-bold text-xs uppercase bg-stone-100 text-stone-750">
                              {user.name?.[0] || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <span className="font-bold text-stone-900 block leading-tight">{user.name}</span>
                            <span className="text-[10px] text-stone-450 block mt-0.5">{user.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* Username */}
                      <td className="p-4 py-3.5 text-stone-750 whitespace-nowrap">
                        @{user.userName || user.email?.split("@")[0]}
                      </td>

                      {/* Role */}
                      <td className="p-4 py-3.5 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          user.role === "admin" ? "bg-red-50 text-red-700 border-red-100" :
                          user.role === "guide" ? "bg-amber-50 text-amber-700 border-amber-100" :
                          user.role === "note-manager" ? "bg-purple-50 text-purple-700 border-purple-100" :
                          "bg-stone-50 text-stone-600 border-stone-150"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="p-4 py-3.5 whitespace-nowrap">
                        {user.verified ? (
                          <span className="flex items-center gap-1 text-emerald-600 font-bold">
                            <ShieldCheck size={16} />
                            <span>Verified Creator</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-stone-400">
                            <XCircle size={15} />
                            <span>Standard User</span>
                          </span>
                        )}
                      </td>

                      {/* XP & Score */}
                      <td className="p-4 py-3.5 text-right whitespace-nowrap">
                        <div className="leading-tight">
                          <span className="font-extrabold text-stone-900 block">{user.xp?.toLocaleString() || 0} XP</span>
                          <span className="text-[10px] text-stone-400 font-semibold block mt-0.5">Posts: {user.totalPosts || 0}</span>
                        </div>
                      </td>

                      {/* Level & Badge */}
                      <td className="p-4 py-3.5 whitespace-nowrap text-stone-500">
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-stone-100 text-stone-700 rounded text-[10px] font-extrabold px-1.5" title="User Level">
                            Lvl {user.level || 1}
                          </div>
                          <div>
                            <span className="font-semibold text-stone-800 block leading-tight">{user.badge || "Newbie"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 py-3.5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-1.5 border border-stone-200 hover:bg-stone-50 rounded text-stone-700 cursor-pointer transition"
                            title="Edit user settings"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="p-1.5 border border-stone-200 hover:bg-rose-50 rounded text-rose-600 hover:border-rose-100 cursor-pointer transition"
                            title="Delete user permanently"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {users.length === 0 && (
                    <tr>
                      <td colSpan="7" className="p-8 text-center text-stone-400">No matching user accounts found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination block */}
            {pagination.totalPages > 1 && (
              <div className="p-4 border-t border-stone-100 flex items-center justify-between bg-stone-50/20 text-xs">
                <span className="font-semibold text-stone-500">
                  Showing {(page - 1) * limit + 1} - {Math.min(page * limit, pagination.totalUsers)} of {pagination.totalUsers} users
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    className="p-1.5 border border-stone-200 rounded hover:bg-stone-50 disabled:opacity-50 disabled:hover:bg-transparent font-medium flex items-center text-stone-750 transition cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>Prev</span>
                  </button>
                  {[...Array(pagination.totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (pageNum === 1 || pageNum === pagination.totalPages || Math.abs(pageNum - page) <= 1) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-2.5 py-1.5 rounded font-bold transition cursor-pointer ${page === pageNum ? "bg-stone-900 text-white" : "border border-stone-200 hover:bg-stone-50 text-stone-755"}`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return <span key={pageNum} className="text-stone-400 px-1 font-semibold">...</span>;
                    }
                    return null;
                  })}
                  <button
                    disabled={page >= pagination.totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-1.5 border border-stone-200 rounded hover:bg-stone-50 disabled:opacity-50 disabled:hover:bg-transparent font-medium flex items-center text-stone-750 transition cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* 4. Edit Modal overlay */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-stone-250/30 p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col gap-5 text-stone-850">
            {/* Header info */}
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-extrabold text-stone-900 text-base">Edit User Profile</h3>
                <p className="text-xs text-stone-450 mt-0.5">Modify database values for {selectedUser.name}.</p>
              </div>
              <button 
                onClick={() => setIsEditOpen(false)}
                className="p-1 border border-stone-100 hover:bg-stone-50 rounded-lg text-stone-450 hover:text-stone-800 transition cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Quick profile info card */}
            <div className="flex items-center gap-3 p-3 bg-stone-50/60 rounded-xl border border-stone-100">
              <Avatar className="size-10 border">
                <AvatarImage src={selectedUser.photo} alt={selectedUser.name} className="object-cover" />
                <AvatarFallback className="font-bold text-xs uppercase bg-stone-100 text-stone-700">
                  {selectedUser.name?.[0] || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-stone-900 truncate leading-none">{selectedUser.name}</p>
                <p className="text-[10px] text-stone-400 truncate mt-1">@{selectedUser.userName || selectedUser.email?.split("@")[0]}</p>
              </div>
            </div>

            {/* Edit fields form */}
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Role select */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Role Permissions</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="p-2 border border-stone-200 rounded-lg text-xs bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-950 text-stone-800 font-semibold"
                  >
                    <option value="user">User (Standard)</option>
                    <option value="guide">Guide (Creator)</option>
                    <option value="admin">Admin (Full Control)</option>
                    <option value="note-manager">Note Manager (Notes Panel)</option>
                  </select>
                </div>

                {/* Verified Toggle */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Verified Creator</label>
                  <div className="flex items-center h-[34px]">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={editVerified} 
                        onChange={(e) => setEditVerified(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-stone-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-stone-900"></div>
                      <span className="ml-2.5 text-xs font-semibold text-stone-700">
                        {editVerified ? "Verified Badge Active" : "Unverified Status"}
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Level input */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Level</label>
                  <input 
                    type="number" 
                    value={editLevel} 
                    onChange={(e) => setEditLevel(Math.max(1, parseInt(e.target.value) || 1))}
                    className="p-2 border border-stone-200 rounded-lg text-xs bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-950 text-stone-800 font-semibold"
                  />
                </div>

                {/* XP input */}
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Experience Points (XP)</label>
                  <input 
                    type="number" 
                    value={editXp} 
                    onChange={(e) => setEditXp(Math.max(0, parseInt(e.target.value) || 0))}
                    className="p-2 border border-stone-200 rounded-lg text-xs bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-950 text-stone-800 font-semibold"
                  />
                </div>
              </div>

              {/* Badge string input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Activity Badge</label>
                <input 
                  type="text" 
                  value={editBadge} 
                  placeholder="e.g. Newbie, Star Creator, Legend..." 
                  onChange={(e) => setEditBadge(e.target.value)}
                  className="p-2 border border-stone-200 rounded-lg text-xs bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-950 text-stone-800 font-semibold"
                />
              </div>

              {/* Status input */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wider">Personal Status Message</label>
                <input 
                  type="text" 
                  value={editStatus} 
                  placeholder="Bio status or system note" 
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="p-2 border border-stone-200 rounded-lg text-xs bg-stone-50 focus:outline-none focus:ring-1 focus:ring-stone-950 text-stone-800 font-semibold"
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 justify-end pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  disabled={submitting}
                  className="p-2 px-4 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="p-2 px-5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold cursor-pointer transition shadow-xs flex items-center gap-1.5"
                >
                  {submitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. Delete Modal confirmation */}
      {isDeleteOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-stone-200 p-6 shadow-2xl relative animate-in zoom-in-95 duration-200 flex flex-col gap-5 text-stone-850">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-full shrink-0">
                <Trash2 size={24} />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-stone-900 text-base">Permanently Delete User?</h3>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Are you sure you want to permanently delete the account for <strong className="text-stone-800">{selectedUser.name}</strong>? 
                  This is a destructive action that cannot be undone and will erase all profile details from the system database.
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                disabled={submitting}
                className="p-2 px-4 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-lg text-xs font-bold transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                disabled={submitting}
                className="p-2 px-5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition shadow-xs"
              >
                {submitting ? "Deleting..." : "Permanently Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
