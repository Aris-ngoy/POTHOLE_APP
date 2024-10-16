//create nextjs api route for file upload to post to this endpoint http://localhost:8000/process
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const formData = await req.formData()
  const file = formData.get('file')

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
  }
  const response = await fetch('http://localhost:8000/process', {
    method: 'POST',
    body: formData,
  })  
  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to process file' }, { status: response.status })
  }
  const data = await response.json() // Parse the JSON response
  return NextResponse.json({ data })
}
