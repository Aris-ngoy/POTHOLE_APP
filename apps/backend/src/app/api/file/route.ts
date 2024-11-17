//create nextjs api route for file upload to post to this endpoint http://localhost:8000/process
import { NextResponse } from 'next/server'
import { MongoClient, GridFSBucket } from 'mongodb'
import { Readable } from 'stream'

// MongoDB connection string - add to your environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }

  try {
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI)
    const db = client.db('potholes')
    const bucket = new GridFSBucket(db, {
      bucketName: 'processed_files'
    })

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    const stream = Readable.from(buffer)

    // Upload to GridFS
    const uploadStream = bucket.openUploadStream(file.name, {
      contentType: file.type,
    })

    await new Promise((resolve, reject) => {
      stream.pipe(uploadStream)
        .on('error', reject)
        .on('finish', resolve)
    })

    // Generate URL for the uploaded file
    const fileUrl = `/api/file/${uploadStream.id}`

    await client.close()

    return NextResponse.json({ 
      url: fileUrl,
      filename: file.name,
      id: uploadStream.id.toString()
    })

  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
