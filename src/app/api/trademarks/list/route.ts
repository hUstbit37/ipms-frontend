import { NextRequest, NextResponse } from 'next/server';
import { findDocuments } from '@/lib/mongodb-utils';
import { ObjectId } from 'mongodb';

/**
 * GET /api/trademarks
 * Get all trademarks with populated applicant and agency data
 */
export async function GET(request: NextRequest) {
  try {
    const trademarks = await findDocuments('trademarks', {}, {
      sort: { created_at: -1 }
    });

    // Get all unique applicant_ids and agency_ids
    const applicantIds = [...new Set(trademarks
      .map((t: any) => t.applicant_id)
      .filter((id: string) => id && ObjectId.isValid(id))
    )];
    
    const agencyIds = [...new Set(trademarks
      .map((t: any) => t.agency_id)
      .filter((id: string) => id && ObjectId.isValid(id))
    )];

    // Fetch companies and agencies
    const [companies, agencies] = await Promise.all([
      applicantIds.length > 0 
        ? findDocuments('companies', { 
            _id: { $in: applicantIds.map(id => new ObjectId(id as string)) } 
          })
        : [],
      agencyIds.length > 0
        ? findDocuments('agencies', { 
            _id: { $in: agencyIds.map(id => new ObjectId(id as string)) } 
          })
        : []
    ]);

    // Create lookup maps
    const companyMap = new Map(companies.map((c: any) => [c._id.toString(), c]));
    const agencyMap = new Map(agencies.map((a: any) => [a._id.toString(), a]));

    // Populate trademarks with company and agency names
    const populatedTrademarks = trademarks.map((trademark: any) => {
      const company = trademark.applicant_id ? companyMap.get(trademark.applicant_id) : null;
      const agency = trademark.agency_id ? agencyMap.get(trademark.agency_id) : null;

      return {
        ...trademark,
        applicant_name: company ? `${company.short_name} - ${company.name}` : trademark.applicant_id || '-',
        agency_name: agency ? `${agency.short_name} - ${agency.name}` : trademark.agency_id || '-',
      };
    });

    return NextResponse.json({
      success: true,
      data: populatedTrademarks,
    });
  } catch (error: any) {
    console.error('Error fetching trademarks:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Error fetching trademarks' 
      },
      { status: 500 }
    );
  }
}
