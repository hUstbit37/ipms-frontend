import { NextResponse } from 'next/server';
import { findDocuments } from '@/lib/mongodb-utils';

/**
 * GET /api/mongodb/countries
 * Lấy danh sách countries từ MongoDB
 */
export async function GET() {
  try {
    const countries = await findDocuments('countries', {}, { 
      sort: { country_name: 1 },
      limit: 1000
    });

    // Transform data to match select options format
    const options = countries.map((country: any) => ({
      label: country.code + " - " + country.country_name,
      value: country.code,
      note: country.note,
      groupDetails: country.group_details
    }));

    return NextResponse.json({
      success: true,
      data: options,
    });
  } catch (error: any) {
    console.error('Error fetching countries:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch countries' 
      },
      { status: 500 }
    );
  }
}
