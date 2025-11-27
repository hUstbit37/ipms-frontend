import { NextResponse } from 'next/server';
import { findDocuments } from '@/lib/mongodb-utils';

/**
 * GET /api/mongodb/nice-classes
 * Lấy danh sách chi tiết phân loại Nice từ MongoDB
 * Query params:
 *   - class_number: Lọc theo số nhóm (group)
 *   - search: Tìm kiếm theo mô tả hàng hóa/dịch vụ
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classNumber = searchParams.get('class_number');
    const search = searchParams.get('search');

    // Build query for nice_classes
    const query: any = {};
    
    if (classNumber) {
      // Search by group field
      query.group = parseInt(classNumber);
    }

    if (search) {
      // Tìm kiếm theo mô tả (hỗ trợ cả tiếng Việt và tiếng Anh)
      query.$or = [
        { name_vi: { $regex: search, $options: 'i' } },
        { name_en: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } }
      ];
    }

    const niceClasses = await findDocuments('nice_classes', query, { 
      sort: { group: 1, code: 1 },
      limit: 500
    });

    // Group by group number for hierarchical display
    const groupedByClass: Record<number, any[]> = {};
    
    niceClasses.forEach((item: any) => {
      if (!groupedByClass[item.group]) {
        groupedByClass[item.group] = [];
      }
      groupedByClass[item.group].push({
        id: item._id,
        classNumber: item.group,
        classCode: item.code,
        description: item.name_vi,
        descriptionEn: item.name_en,
      });
    });

    return NextResponse.json({
      success: true,
      data: {
        items: niceClasses.map((item: any) => ({
          id: item._id,
          classNumber: item.group,
          classCode: item.code,
          description: item.name_vi,
          descriptionEn: item.name_en,
        })),
        grouped: groupedByClass
      },
    });
  } catch (error: any) {
    console.error('Error fetching nice classes:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch nice classes' 
      },
      { status: 500 }
    );
  }
}
