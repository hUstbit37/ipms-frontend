import { NextResponse } from 'next/server';
import { findDocuments } from '@/lib/mongodb-utils';

/**
 * GET /api/mongodb/companies
 * Lấy danh sách companies từ MongoDB
 */
export async function GET() {
  try {
    const companies = await findDocuments('companies', {}, { 
      sort: { name: 1 },
      limit: 1000
    });

    // Transform data to match select options format
    const options = companies.map((company: any) => ({
      label: `${company.short_name} - ${company.name}`,
      value: company._id.toString(),
      shortName: company.short_name,
      name: company.name,
      taxCode: company.tax_code,
      address: company.address
    }));

    return NextResponse.json({
      success: true,
      data: options,
    });
  } catch (error: any) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch companies' 
      },
      { status: 500 }
    );
  }
}
