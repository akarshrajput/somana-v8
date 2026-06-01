"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import supabase from "@/app/_lib/supabase";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
// import LoadingMain from "../main/Loading";
// import { Spinner, useToast } from "@chakra-ui/react";
// import AlertBox from "../main/AlertBox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import TiptapEditor from "../editor/TiptapEditor";

const categories = [
  "Blog",
  "Automotive",
  "Beauty",
  "Books",
  "Business",
  "Career",
  "Cryptocurrency",
  "Culture",
  "Crafts",
  "Design",
  "Education",
  "Entertainment",
  "Environmental",
  "Fashion",
  "Finance",
  "Fitness",
  "Food",
  "Gaming",
  "Gardening",
  "Health",
  "History",
  "Home",
  "Humor",
  "Interests",
  "Investing",
  "Legal",
  "Lifestyle",
  "Luxury",
  "Marketing",
  "Movies",
  "Music",
  "News",
  "Nonprofit",
  "Notes",
  "Parenting",
  "Pets",
  "Photography",
  "Politics",
  "Estate",
  "Relationships",
  "Science",
  "Shopping",
  "Social",
  "Space",
  "Spirituality",
  "Sports",
  "Startups",
  "Story",
  "Technology",
  "Tips",
  "Travel",
  "Volunteer",
  "Writing",
];

const UpdateBlog = ({ storyId, supabaseURL, session, hostname }) => {
  // const toast = useToast();
  const [heading, setHeading] = useState("");
  const [userId, setUserId] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [fileLinks, setFileLinks] = useState("");
  const [genre, setGenre] = useState("Blog");
  const [featuredImage, setFeaturedImage] = useState(null);
  const [currentFeaturedImage, setCurrentFeaturedImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        const response = await axios.get(`/api/v1/blogs/${storyId}`);
        const data = response?.data?.data;

        setHeading(data.heading);
        setDescription(data.description);
        setFileLinks(data.fileLinks);
        setContent(data.content);
        setTags(data.tags);
        setGenre(data.genre);
        setUserId(data.author._id);
        setCurrentFeaturedImage(data.featuredImage);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    if (storyId) {
      fetchBlogData();
    }
  }, [storyId]);

  if (!session) {
    return (
      <div className="text-center">
        <p className="font-medium">No Permission to edit this Story</p>
      </div>
    );
  }

  if (session.user.role !== "admin" && session.user.userId !== userId) {
    return (
      <div className="text-center">
        <p className="font-medium">No Permission to edit this Story</p>
      </div>
    );
  }

  const uploadToSupabase = async (file) => {
    const imageName = `${Math.random()}-${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("blog-featured-images")
      .upload(imageName, file);

    if (error) throw new Error(error.message || "Failed to upload image");

    return `${supabaseURL}/storage/v1/object/public/blog-featured-images/${imageName}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!heading || !description || !tags || !genre) {
      toast.error("Please fill in all required fields (Heading, Description, Tags, Genre)");
      return;
    }

    if (heading.length < 10) {
      toast.error("Heading must be at least 10 characters long");
      return;
    }

    if (description.length < 20) {
      toast.error("Description must be at least 20 characters long");
      return;
    }

    if (featuredImage && featuredImage.type.split("/")[0] !== "image") {
      toast.error("Only image files are allowed for the description photo");
      return;
    }

    try {
      setIsLoading(true);

      // Prepare blog data for MongoDB
      const blogData = {
        heading,
        description,
        content,
        fileLinks,
        tags,
        genre,
      };

      if (featuredImage) {
        const newImagePath = await uploadToSupabase(featuredImage);
        blogData.featuredImage = newImagePath;
      }

      const response = await axios.patch(`/api/v1/blogs/${storyId}`, blogData, {
        headers: { "Content-Type": "application/json" },
      });

      const slug = response?.data?.data?.updatedBlog?.slug;
      toast.success("Story updated successfully!");
      router.push(`/story/${slug}`);

      // Reset form fields
      setHeading("");
      setDescription("");
      setContent("");
      setTags("");
      setFileLinks("");
      setFeaturedImage(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.response?.data?.message || "Error updating story!";
      toast.error(errorMessage);
      console.error("Error posting Blog:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleHeadingChange = (e) => {
    if (e.target.value.length <= 100) {
      setHeading(e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length <= 300) {
      setDescription(e.target.value);
    }
  };

  const handleContentChange = (value) => {
    if (value.length <= 200000) {
      setContent(value);
    }
  };
  const handleTagsChange = (e) => {
    if (e.target.value.length <= 15) {
      setTags(e.target.value);
    }
  };
  const handleFileLinksChange = (e) => {
    setFileLinks(e.target.value);
  };

  const handleGenreChange = (e) => {
    if (e.target.value.length <= 15) {
      setGenre(e.target.value);
    }
  };

  return (
    <div>
      <form className="rounded-md flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-2  py-1">
          <Label>Heading</Label>
          <Input
            value={heading}
            onChange={handleHeadingChange}
            placeholder="Write heading"
          />
        </div>
        <div className="flex flex-col gap-2  py-1">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Write description"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 py-1">
          <div className="flex flex-col gap-2">
            <Label>Description photo</Label>
            <div className="flex items-center gap-2">
              {currentFeaturedImage && (
                <img
                  src={currentFeaturedImage}
                  alt="Current Description"
                  className="w-10 h-10 object-cover rounded border border-stone-200"
                />
              )}
              <Input
                type="file"
                onChange={(e) => setFeaturedImage(e.target.files[0])}
                className="w-fit"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Tags</Label>
            <Input
              value={tags}
              onChange={handleTagsChange}
              placeholder="Write Tags"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Genre</Label>
            <Select value={genre} onValueChange={(value) => setGenre(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a genre" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                {(session.user.role === "admin" ||
                  session.user.role === "guide") && (
                  <SelectItem value="top-10">Top 10</SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label>File Links</Label>
          <Input
            value={fileLinks}
            onChange={handleFileLinksChange}
            placeholder="Paste links (Drive, Office and many more)"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Write content</Label>
          <div className="">
            <TiptapEditor content={content} onChange={handleContentChange} />
          </div>
        </div>

        <div className="py-1">
          {isLoading ? <Label>Please do not close this window</Label> : ""}

          <Button disabled={isLoading}>
            {isLoading ? (
              // <Spinner size="sm" />
              <p>Loading</p>
            ) : (
              <div className="flex items-center gap-1">
                <p>Update</p>
              </div>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateBlog;
