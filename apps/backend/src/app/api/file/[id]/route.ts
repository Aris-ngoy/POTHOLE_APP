// ... existing imports and POST route ...

import { GridFSBucket, MongoClient, ObjectId } from "mongodb"
import { NextResponse } from "next/server"

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017'

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const fileId = params.id
    if (!fileId) {
      return NextResponse.json({ error: 'File ID not provided' }, { status: 400 })
    }
  
    // Connect to MongoDB
    const client = await MongoClient.connect(MONGODB_URI)
    const db = client.db('potholes')
    const bucket = new GridFSBucket(db, {
      bucketName: 'processed_files'
    })
  
    // Find file metadata
    const files = await bucket.find({ _id: new ObjectId(fileId) }).toArray()
    if (!files.length) {
      await client.close()
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }
  
    // Download file
    const downloadStream = bucket.openDownloadStream(new ObjectId(fileId))
    const chunks: Buffer[] = []
  
    const buffer = await new Promise<Buffer>((resolve, reject) => {
      downloadStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
      downloadStream.on('error', reject)
      downloadStream.on('end', () => resolve(Buffer.concat(chunks)))
    })
  
    await client.close()
  
    // Return file with appropriate content type
    return new Response(buffer, {
      headers: {
        'Content-Type': files[0].contentType || 'application/octet-stream',
        'Content-Disposition': `inline; filename="${files[0].filename}"`,
      },
    })
  } catch (error) {
    console.error('Error downloading file:', error)
    return NextResponse.json({ error: 'Failed to download file' }, { status: 500 })
  }
}