import { NextResponse } from 'next/server';
import { findDocuments } from '@/lib/mongodb-utils';

/**
 * GET /api/mongodb/agencies
 * Lấy danh sách agencies từ MongoDB
 */
export async function GET() {
  try {
    const agencies = await findDocuments('agencies', {}, { 
      sort: { name: 1 },
      limit: 1000
    });

    // Transform data to match select options format
    const options = agencies.map((agency: any) => ({
      label: `${agency.short_name} - ${agency.name}`,
      value: agency._id.toString(),
      shortName: agency.short_name,
      name: agency.name,
      taxCode: agency.tax_code,
      address: agency.address
    }));

    return NextResponse.json({
      success: true,
      data: options,
    });
  } catch (error: any) {
    console.error('Error fetching agencies:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch agencies' 
      },
      { status: 500 }
    );
  }
}
