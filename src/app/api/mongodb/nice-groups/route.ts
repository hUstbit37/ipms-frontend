import { NextResponse } from 'next/server';
import { findDocuments } from '@/lib/mongodb-utils';

/**
 * GET /api/mongodb/nice-groups
 * Lấy danh sách nhóm Nice từ MongoDB
 */
export async function GET() {
  try {
    const niceGroups = await findDocuments('nice_groups', {}, { 
      sort: { group: 1 },
      limit: 1000
    });

    // Transform data to match select options format
    const options = niceGroups.map((group: any) => ({
      label: `Nhóm ${group.group}`,
      value: group.group.toString(),
      classNumber: group.group,
      description: group.name_vi,
      descriptionEn: group.name_en,
      type: group.type // 'goods' or 'services'
    }));

    return NextResponse.json({
      success: true,
      data: options,
    });
  } catch (error: any) {
    console.error('Error fetching nice groups:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch nice groups' 
      },
      { status: 500 }
    );
  }
}
