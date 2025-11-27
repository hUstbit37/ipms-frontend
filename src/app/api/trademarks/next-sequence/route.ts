import { NextRequest, NextResponse } from 'next/server';
import { countDocuments } from '@/lib/mongodb-utils';

/**
 * GET /api/trademarks/next-sequence
 * Get next sequence number for trademark code (global counter for all trademarks)
 */
export async function GET(request: NextRequest) {
  try {
    // Count all existing trademarks (not filtered by ip_family)
    const count = await countDocuments('trademarks', {});
    
    // Next sequence number (count + 1), padded to 3 digits
    const nextSequence = String(count + 1).padStart(3, '0');

    return NextResponse.json({
      success: true,
      data: {
        sequence: nextSequence,
        count: count,
      },
    });
  } catch (error: any) {
    console.error('Error getting next sequence:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Error getting next sequence' 
      },
      { status: 500 }
    );
  }
}
