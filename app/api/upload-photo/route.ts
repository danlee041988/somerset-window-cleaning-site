import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const filename = formData.get('filename') as string

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file
    const maxSize = 10 * 1024 * 1024 // 10MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/heic']
    
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      )
    }
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please use JPG, PNG, WebP, or HEIC.' },
        { status: 400 }
      )
    }

    // Use environment variable
    const workingApiKey = process.env.NOTION_API_KEY
    
    console.log(`📸 Starting upload for: ${filename} (${(file.size / 1024 / 1024).toFixed(2)}MB)`)

    // Step 1: Create file upload object in Notion
    const createUploadResponse = await fetch('https://api.notion.com/v1/file_uploads', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${workingApiKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filename: filename || file.name
      })
    })

    if (!createUploadResponse.ok) {
      const error = await createUploadResponse.json()
      console.error('❌ Failed to create file upload object:', error)
      return NextResponse.json(
        { error: 'Failed to initiate file upload' },
        { status: 500 }
      )
    }

    const uploadObject = await createUploadResponse.json()
    const fileUploadId = uploadObject.id
    
    console.log(`✅ Created upload object with ID: ${fileUploadId}`)

    // Step 2: Upload file content to Notion
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)

    const sendFileResponse = await fetch(`https://api.notion.com/v1/file_uploads/${fileUploadId}/send`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${workingApiKey}`,
        'Notion-Version': '2022-06-28'
        // Note: Don't set Content-Type for FormData, let browser set it with boundary
      },
      body: uploadFormData
    })

    if (!sendFileResponse.ok) {
      const error = await sendFileResponse.json()
      console.error('❌ Failed to upload file content:', error)
      return NextResponse.json(
        { error: 'Failed to upload file content' },
        { status: 500 }
      )
    }

    const uploadResult = await sendFileResponse.json()
    console.log(`✅ Successfully uploaded file: ${filename}`)

    // Return the file upload ID for later attachment to Notion page
    return NextResponse.json({
      success: true,
      fileUploadId: fileUploadId,
      filename: filename || file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Photo upload error:', error)
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    )
  }
}