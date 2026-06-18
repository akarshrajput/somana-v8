"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Check, X, Loader2 } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

function PodcastPlayer({ audioUrl, image, title, trigger, description, podcast, currentUserId }) {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(title);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if current user is the author
  const authorId = podcast?.author?._id || podcast?.author;
  const isOwner = currentUserId && authorId === currentUserId;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this podcast?")) return;
    try {
      setIsDeleting(true);
      await axios.delete(`/api/v1/podcasts/${podcast._id}`);
      toast.success("Podcast deleted successfully");
      queryClient.invalidateQueries(["podcasts"]);
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to delete podcast");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSave = async () => {
    if (!editName.trim()) {
      toast.error("Title cannot be empty");
      return;
    }
    try {
      setIsSaving(true);
      await axios.patch(`/api/v1/podcasts/${podcast._id}`, { podcastName: editName });
      toast.success("Podcast updated successfully");
      queryClient.invalidateQueries(["podcasts"]);
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update podcast");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="bg-gradient-to-br bg-white border-none">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="rounded-lg overflow-hidden mx-auto w-full relative group">
            <img
              className="h-60 w-full object-cover rounded-md shadow-lg"
              src={image}
              alt={title}
            />
            {isOwner && (
              <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={() => setIsEditing(!isEditing)}>
                  <Pencil size={14} />
                </Button>
                <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                </Button>
              </div>
            )}
          </div>
          <div>
            {isEditing ? (
              <div className="flex items-center gap-2 mb-1 justify-center">
                <Input 
                  value={editName} 
                  onChange={(e) => setEditName(e.target.value)} 
                  className="h-8 text-sm"
                  autoFocus
                />
                <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleEditSave} disabled={isSaving}>
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                </Button>
                <Button size="icon" variant="outline" className="h-8 w-8 shrink-0" onClick={() => { setIsEditing(false); setEditName(title); }}>
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <AlertDialogTitle className="text-sm font-medium mb-1 line-clamp-1">{title}</AlertDialogTitle>
            )}
            <AlertDialogDescription asChild>
              <p className="text-xs">{description}</p>
            </AlertDialogDescription>
          </div>
          <div className="mt-4">
            <AudioPlayer
              autoPlay
              src={audioUrl}
              layout="stacked-reverse"
              className="rounded-lg overflow-hidden"
            />
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel onClick={() => setIsEditing(false)}>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PodcastPlayer;
