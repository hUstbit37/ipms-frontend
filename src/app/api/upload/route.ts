import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

/**
 * POST /api/upload
 * Upload images to public/images folder
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No files uploaded' },
        { status: 400 }
      );
    }

    const uploadedUrls: string[] = [];
    const uploadDir = path.join(process.cwd(), 'public', 'images');

    // Create directory if it doesn't exist
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    for (const file of files) {
      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const ext = path.extname(file.name);
      const filename = `${timestamp}-${randomString}${ext}`;
      const filepath = path.join(uploadDir, filename);

      // Convert file to buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Store relative URL path
      uploadedUrls.push(`/images/${filename}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        urls: uploadedUrls,
      },
    });
  } catch (error: any) {
    console.error('Error uploading files:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Error uploading files',
      },
      { status: 500 }
    );
  }
}
