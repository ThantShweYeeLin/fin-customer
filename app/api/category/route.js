import dbConnect from '../../../lib/db'
import Category from "@/models/Category";

export async function GET(request) {
  try {
    console.log('GET /api/category - Attempting to connect to database...')
    await dbConnect()
    console.log('GET /api/category - Database connected, fetching categories...')
    
    const pno = request.nextUrl.searchParams.get("pno")
    if (pno) {
      const size = 3 // TODO fix this hard code
      const startIndex = (pno - 1) * size
      const categories = await Category.find()
        .sort({ order: -1 })
        .skip(startIndex)
        .limit(size)
      console.log(`GET /api/category - Found ${categories.length} categories (page ${pno})`)
      return Response.json(categories)
    }

    const s = request.nextUrl.searchParams.get("s")
    if (s) {
      const categories = await Category
        .find({ name: { $regex: s, $options: 'i' } })
        .sort({ order: -1 })
      console.log(`GET /api/category - Found ${categories.length} categories (search: ${s})`)
      return Response.json(categories)
    }

    const categories = await Category.find().sort({ order: -1 })
    console.log(`GET /api/category - Found ${categories.length} categories`)
    return Response.json(categories)
  } catch (error) {
    console.error('GET /api/category - Error:', error)
    return Response.json(
      { 
        error: 'Failed to fetch categories', 
        details: error.message,
        mongoURI: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
      }, 
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    console.log('POST /api/category - Attempting to connect to database...')
    await dbConnect()
    console.log('POST /api/category - Database connected, creating category...')
    
    const body = await request.json()
    console.log('POST /api/category - Request body:', body)
    
    const category = new Category(body)
    await category.save()
    console.log('POST /api/category - Category created:', category._id)
    
    return Response.json(category)
  } catch (error) {
    console.error('POST /api/category - Error:', error)
    return Response.json(
      { 
        error: 'Failed to create category', 
        details: error.message,
        mongoURI: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
      }, 
      { status: 500 }
    )
  }
}

// for V2
export async function PUT(request) {
  try {
    console.log('PUT /api/category - Attempting to connect to database...')
    await dbConnect()
    console.log('PUT /api/category - Database connected, updating category...')
    
    const body = await request.json()
    console.log('PUT /api/category - Request body:', body)
    
    const category = await Category.findByIdAndUpdate(body._id, body)
    console.log('PUT /api/category - Category updated:', category._id)
    
    return Response.json(category)
  } catch (error) {
    console.error('PUT /api/category - Error:', error)
    return Response.json(
      { 
        error: 'Failed to update category', 
        details: error.message,
        mongoURI: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
      }, 
      { status: 500 }
    )
  }
}