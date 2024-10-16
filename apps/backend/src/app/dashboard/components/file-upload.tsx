'use client'

import { useState, useRef } from 'react'
import { Upload, Check, AlertCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import axios from 'axios' // Import Axios

export default function FileUploader() {

  const [file, setFile] = useState<File | null>(null)
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)
  const [uploadComplete, setUploadComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0])
      setError(null)
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload')
      return
    }

    setUploading(true)
    setProgress(0)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    // Use Axios for the upload
    try {
      const response = await axios.request({
        method: 'post',
        maxBodyLength: Infinity,
        url: 'api/process',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        data: formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            setProgress(progress)
          }
        },
      })

      if (response.status !== 200) {
        setError('Upload failed')
        return
      }
      setUploadComplete(true)
    } catch (error) {
      console.error('Error uploading file:', error)
      setError('An error occurred during upload')
    } finally {
      setUploading(false) // Set uploading to false after sending
    }
  }  
  
  return (
    <div className="w-full max-w-md mx-auto p-6 space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">File Uploader</h2>
        <p className="text-gray-600 mb-4">Upload a new video or photo</p>
      </div>
      <div className="flex items-center justify-center w-full">
        <label htmlFor="file-upload" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-10 h-10 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF</p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
            ref={fileInputRef}
          />
        </label>
      </div>
      {file && (
        <div className="text-sm text-gray-500 text-center">
          Selected file: {file.name}
        </div>
      )}
      {uploading && (
        <Progress value={progress} className="w-full" />
      )}
      {error && (
        <div className="flex items-center text-red-500">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      )}
      {uploadComplete && (
        <div className="flex items-center text-green-500">
          <Check className="w-4 h-4 mr-2" />
          Upload complete!
        </div>
      )}
      <Button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="w-full"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </Button>
    </div>
  )
}
