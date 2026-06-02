"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Folder, File, Plus, Trash2, ChevronRight, Home, ExternalLink, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function NotesManagement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const parentId = searchParams.get("parent") || null;
  const parentName = searchParams.get("parentName") || "";

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [showFileModal, setShowFileModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Colleges");
  const [description, setDescription] = useState("");
  const [keywords, setKeywords] = useState("");
  const [iframeUrl, setIframeUrl] = useState("");

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const url = parentId 
        ? `/api/v1/notes?parent=${parentId}` 
        : `/api/v1/notes?parent=null`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) setNotes(data);
    } catch (err) {
      toast.error("Failed to load notes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [parentId]);

  const handleSubmit = async (type) => {
    if (!name || !description || !keywords) {
      return toast.error("Please fill required fields (Name, Description, Keywords)");
    }
    if (type === "file" && !iframeUrl) {
      return toast.error("File requires an Iframe URL");
    }

    // Automatically extract src URL if user pasted a full HTML <iframe> tag
    let finalIframeUrl = iframeUrl;
    if (type === "file" && iframeUrl.includes("<iframe")) {
      const srcMatch = iframeUrl.match(/src=["'](.*?)["']/);
      if (srcMatch && srcMatch[1]) {
        finalIframeUrl = srcMatch[1];
      }
    }

    try {
      const isEditing = !!editingNote;
      const url = isEditing ? `/api/v1/notes/${editingNote.slug}` : "/api/v1/notes";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          name,
          category: !parentId ? category : undefined,
          parent: isEditing ? undefined : parentId, // don't update parent on edit for now
          description,
          keywords,
          iframeUrl: type === "file" ? finalIframeUrl : undefined,
        }),
      });

      if (res.ok) {
        toast.success(`${type === "folder" ? "Folder" : "File"} ${isEditing ? 'updated' : 'created'}!`);
        setShowFolderModal(false);
        setShowFileModal(false);
        resetForms();
        fetchNotes();
      } else {
        const err = await res.json();
        toast.error(err.error || `Failed to ${isEditing ? 'update' : 'create'}`);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  const handleDelete = async (slug) => {
    if (!confirm("Are you sure? This will delete the item and all its children!")) return;
    try {
      const res = await fetch(`/api/v1/notes/${slug}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Deleted successfully");
        fetchNotes();
      } else {
        toast.error("Failed to delete");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  const resetForms = () => {
    setName("");
    setDescription("");
    setKeywords("");
    setIframeUrl("");
    setEditingNote(null);
  };

  const handleEditClick = (note) => {
    setEditingNote(note);
    setName(note.name);
    setDescription(note.description);
    setKeywords(note.keywords);
    if (note.category) setCategory(note.category);
    if (note.type === "file") {
      setIframeUrl(note.iframeUrl || "");
      setShowFileModal(true);
    } else {
      setShowFolderModal(true);
    }
  };

  const navigateToFolder = (id, fName) => {
    router.push(`/admin/notes-management?parent=${id}&parentName=${fName}`);
  };

  const navigateUp = () => {
    // Basic navigate up (for simplicity, goes back to root)
    // To support full breadcrumbs, we'd pass a path array in URL or fetch parent chain from DB
    router.push(`/admin/notes-management`);
  };

  return (
    <div className="p-6 text-stone-800">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Notes Management</h1>
          <div className="flex items-center gap-2 mt-2 text-sm text-stone-500">
            <button onClick={navigateUp} className="hover:text-stone-900 flex items-center gap-1">
              <Home size={14} /> Root
            </button>
            {parentId && (
              <>
                <ChevronRight size={14} />
                <span className="font-semibold text-stone-800">{parentName}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setShowFolderModal(true)} variant="outline" className="flex items-center gap-2">
            <Folder size={16} /> Add Folder
          </Button>
          <Button onClick={() => setShowFileModal(true)} className="flex items-center gap-2">
            <File size={16} /> Add File Link
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-stone-500">Loading...</p>
      ) : notes.length === 0 ? (
        <div className="py-12 text-center bg-stone-50 rounded-lg border border-stone-200">
          <Folder size={48} className="mx-auto text-stone-300 mb-3" />
          <h3 className="font-medium text-stone-700">Empty Directory</h3>
          <p className="text-sm text-stone-500">No folders or files here yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {notes.map((note) => (
            <div 
              key={note._id} 
              className="bg-white p-4 border border-stone-200 rounded-xl shadow-xs hover:border-stone-300 transition group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-2">
                  <div 
                    onClick={() => note.type === "folder" ? navigateToFolder(note._id, note.name) : null}
                    className={`p-2 rounded-lg ${note.type === "folder" ? "bg-blue-50 text-blue-600 cursor-pointer" : "bg-emerald-50 text-emerald-600"}`}
                  >
                    {note.type === "folder" ? <Folder size={24} /> : <File size={24} />}
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleEditClick(note)}
                      className="p-1.5 text-stone-400 hover:bg-blue-50 hover:text-blue-600 rounded transition opacity-0 group-hover:opacity-100"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(note.slug)}
                      className="p-1.5 text-stone-400 hover:bg-red-50 hover:text-red-600 rounded transition opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <h3 
                  onClick={() => note.type === "folder" ? navigateToFolder(note._id, note.name) : null}
                  className={`font-semibold text-stone-800 line-clamp-1 ${note.type === "folder" ? "cursor-pointer hover:underline" : ""}`}
                >
                  {note.name}
                </h3>
                {note.type === "file" && (
                  <a href={note.iframeUrl} target="_blank" rel="noreferrer" className="text-[10px] flex items-center gap-1 text-stone-400 hover:text-stone-600 mt-1">
                    <ExternalLink size={10} /> View Link
                  </a>
                )}
                {!parentId && note.category && (
                  <span className="text-[10px] font-medium px-2 py-0.5 bg-stone-100 rounded text-stone-600 mt-2 inline-block">
                    {note.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {(showFolderModal || showFileModal) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">
              {editingNote 
                ? `Edit ${showFolderModal ? 'Folder' : 'File'}` 
                : (showFolderModal ? "Create New Folder" : "Add File Link")}
            </h2>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. B.Tech Computer Science" />
              </div>
              
              {!parentId && showFolderModal && (
                <div>
                  <Label>Category</Label>
                  <select 
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 border border-stone-200 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
                  >
                    <option value="Colleges">Colleges</option>
                    <option value="Courses">Courses</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              )}

              {showFileModal && (
                <div>
                  <Label>Iframe / Link URL</Label>
                  <Input value={iframeUrl} onChange={(e) => setIframeUrl(e.target.value)} placeholder="https://drive.google.com/..." />
                  <p className="text-[10px] text-stone-500 mt-1">Provide the embed link (e.g. from Google Drive or OneDrive).</p>
                </div>
              )}

              <div>
                <Label>SEO Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="A robust description for search engines..." />
              </div>

              <div>
                <Label>SEO Keywords</Label>
                <Input value={keywords} onChange={(e) => setKeywords(e.target.value)} placeholder="notes, cse, btech (comma separated)" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => { setShowFolderModal(false); setShowFileModal(false); resetForms(); }}>
                  Cancel
                </Button>
                <Button onClick={() => handleSubmit(showFolderModal ? "folder" : "file")}>
                  {editingNote ? "Save Changes" : `Save ${showFolderModal ? "Folder" : "File"}`}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
