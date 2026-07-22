"use client"
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import axios from "axios";

import { formData } from "@/types/interfaces";

const UploadVideo = () => {
  const [formData, setformData] = useState<formData>({
    file: null,
    title: "",
    description: "",
  });

  const [isUploading, setIsUploading] = useState(false);

  const router = useRouter();

  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.file) return;

    if (formData.file.size > MAX_FILE_SIZE) {
      alert("File size too large !");
      return;
    }

    setIsUploading(true);

    const formDataAppend = new FormData();
    formDataAppend.append("file", formData.file);
    formDataAppend.append("title", formData.title);
    formDataAppend.append("description", formData.description);
    formDataAppend.append("originalSize", formData.file.size.toString());

    try {
      const response = await axios.post("/api/upload-video", formDataAppend);

      if (response.status == 200) {
        console.log("File uploaded successfully");
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => {
                setformData({...formData, title: e.target.value });
              }}
              className="input input-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => {
                setformData({...formData, description: e.target.value });
              }}
              className="textarea textarea-bordered w-full"
              required
            />
          </div>

          <div>
            <label className="label">
              <span className="label-text">Video File</span>
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                setformData({...formData, file: e.target.files?.[0] || null });
              }}
              className="file-input file-input-bordered w-full"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={isUploading}>
              {isUploading ? "Uploading" : "Upload Video"}
          </button>
          
        </form>
      </div>
    </main>
  );
};

export default UploadVideo;
