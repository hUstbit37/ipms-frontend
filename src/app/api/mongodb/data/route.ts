import { NextRequest, NextResponse } from 'next/server';
import {
  findDocuments,
  findOneDocument,
  insertDocument,
  updateDocument,
  deleteDocument,
  countDocuments,
} from '@/lib/mongodb-utils';

const COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME || 'ocr_extractions_raw';

/**
 * Get all documents or single document by ID
 * GET /api/mongodb/data?id=xxx or GET /api/mongodb/data
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');

    if (id) {
      // Get single document
      const document = await findOneDocument(COLLECTION_NAME, { _id: id } as any);
      
      if (!document) {
        return NextResponse.json(
          { success: false, message: 'Document not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: document,
      });
    }

    // Get all documents with pagination
    const [documents, total] = await Promise.all([
      findDocuments(COLLECTION_NAME, {}, { limit, skip, sort: { _id: -1 } }),
      countDocuments(COLLECTION_NAME),
    ]);

    return NextResponse.json({
      success: true,
      data: documents,
      pagination: {
        total,
        limit,
        skip,
        hasMore: skip + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch documents',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Create a new document
 * POST /api/mongodb/data
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Add timestamp
    const document = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await insertDocument(COLLECTION_NAME, document);

    return NextResponse.json({
      success: true,
      message: 'Document created successfully',
      data: {
        insertedId: result.insertedId,
      },
    });
  } catch (error) {
    console.error('Error creating document:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create document',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Update a document
 * PUT /api/mongodb/data?id=xxx
 */
export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Document ID is required' },
        { status: 400 }
      );
    }

    const body = await request.json();

    const result = await updateDocument(
      COLLECTION_NAME,
      { _id: id } as any,
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Document updated successfully',
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  } catch (error) {
    console.error('Error updating document:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update document',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Delete a document
 * DELETE /api/mongodb/data?id=xxx
 */
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Document ID is required' },
        { status: 400 }
      );
    }

    const result = await deleteDocument(COLLECTION_NAME, { _id: id } as any);

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: 'Document not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting document:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete document',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
