import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

/**
 * Test MongoDB connection
 * GET /api/mongodb/test
 */
export async function GET() {
  try {
    // Get database instance
    const db = await getDatabase();
    
    // Test connection by running a simple command
    const adminDb = db.admin();
    const result = await adminDb.ping();
    
    // Get database stats
    const stats = await db.stats();
    
    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful',
      database: db.databaseName,
      stats: {
        collections: stats.collections,
        dataSize: stats.dataSize,
        indexSize: stats.indexSize,
      },
      ping: result,
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to connect to MongoDB',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
