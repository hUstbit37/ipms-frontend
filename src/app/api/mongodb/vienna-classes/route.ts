import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search')

    const client = await clientPromise
    const db = client.db('ipms')
    const collection = db.collection('vienna_class')

    let query = {}
    
    if (search) {
      // Search across all description fields
      query = {
        $or: [
          { category_desc_vi: { $regex: search, $options: 'i' } },
          { category_desc_en: { $regex: search, $options: 'i' } },
          { division_desc_vi: { $regex: search, $options: 'i' } },
          { division_desc_en: { $regex: search, $options: 'i' } },
          { section_desc_vi: { $regex: search, $options: 'i' } },
          { section_desc_en: { $regex: search, $options: 'i' } }
        ]
      }
    }

    const results = await collection
      .find(query)
      .sort({ category: 1, division: 1, section: 1 })
      .limit(200) // Limit results for performance
      .toArray()

    return NextResponse.json({
      success: true,
      data: results
    })
  } catch (error) {
    console.error('Error fetching Vienna classifications:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch Vienna classifications',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
