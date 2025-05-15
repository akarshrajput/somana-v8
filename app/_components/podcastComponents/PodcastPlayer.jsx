"use client";

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

function PodcastPlayer({ audioUrl, image, title, trigger }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-sm mb-2">{title}</AlertDialogTitle>
          <div className="rounded overflow-hidden">
            <img
              className="h-full max-h-72 w-full object-cover"
              src={image}
              alt={title}
            />
          </div>
          <AlertDialogDescription>
            <AudioPlayer autoPlay={true} src={audioUrl} onPlay={() => {}} />
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PodcastPlayer;
