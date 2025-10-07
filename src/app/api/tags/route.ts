import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/tags - Get all tags
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') as 'language' | 'topic' | null;

    let tags;
    if (type) {
      tags = await db.tag.findByType(type);
    } else {
      tags = await db.tag.findAll();
    }

    return NextResponse.json({ tags });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tags' },
      { status: 500 }
    );
  }
}
