'use client'
import { Button } from "@/components/ui/button";
import { CldUploadButton, CloudinaryUploadWidgetInfo } from 'next-cloudinary';
import { useState } from 'react';

export default function Home() {
  const [uploadedImage, setUploadedImage] = useState<CloudinaryUploadWidgetInfo | null>(null);
  return (
    <>
    <div className="bg-white text-black">Hello, Next.js!</div>
    <Button variant={"secondary"}>Click me</Button>
     <main style={{ padding: '2rem' }}>
      <h1>Upload an Image</h1>

      <div style={{
        backgroundColor: '#0070f3',
        color: 'white',
        padding: '12px 24px',
        border: 'none',
        borderRadius: '6px',
        fontSize: '16px',
        fontWeight: '500',
        cursor: 'pointer',
        display: 'inline-block'
      }}>
        <CldUploadButton
          uploadPreset="learningSaas"
          onSuccess={(result) => {
            if (result.info && typeof result.info !== 'string') {
              setUploadedImage(result.info);
              console.log('Upload successful:', result.info);
            }
          }}
          onQueuesEnd={(result, { widget }) => {
            widget.close();
          }}
        >
          Upload Image
        </CldUploadButton>
      </div>

      {uploadedImage && (
        <div style={{ marginTop: '2rem' }}>
          <p>Upload successful!</p>
          <p><strong>Public ID:</strong> {uploadedImage.public_id}</p>
          <p><strong>Image URL:</strong> {uploadedImage.secure_url}</p>
          <p><strong>Image ID:</strong> {uploadedImage.id}</p>
          <p><strong>Created At:</strong> {uploadedImage.created_at}</p>
        </div>
      )}
    </main>
    </>
  )
}
