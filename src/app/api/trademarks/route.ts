import { NextRequest, NextResponse } from 'next/server';
import { insertDocument } from '@/lib/mongodb-utils';

/**
 * POST /api/trademarks
 * Create a new trademark
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { success: false, message: 'Tên nhãn hiệu là bắt buộc' },
        { status: 400 }
      );
    }

    if (!body.trademark_type) {
      return NextResponse.json(
        { success: false, message: 'Kiểu nhãn hiệu là bắt buộc' },
        { status: 400 }
      );
    }

    // Prepare trademark data
    const trademarkData = {
      ...body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Insert into MongoDB
    const result = await insertDocument('trademarks', trademarkData);

    return NextResponse.json({
      success: true,
      message: 'Thêm nhãn hiệu thành công',
      data: result,
    });
  } catch (error: any) {
    console.error('Error creating trademark:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Lỗi khi thêm nhãn hiệu' 
      },
      { status: 500 }
    );
  }
}
