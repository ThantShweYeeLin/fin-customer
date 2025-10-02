import dbConnect from '../../../lib/db'
import Customer from '../../../models/Customer'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        console.log('GET /api/customer - Attempting to connect to database...')
        await dbConnect()
        console.log('GET /api/customer - Database connected, fetching customers...')
        
        const customers = await Customer.find({})
        console.log(`GET /api/customer - Found ${customers.length} customers`)
        
        return NextResponse.json(customers)
    } catch (error) {
        console.error('GET /api/customer - Error:', error)
        return NextResponse.json(
            { 
                error: 'Failed to fetch customers', 
                details: error.message,
                mongoURI: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
            }, 
            { status: 500 }
        )
    }
}

export async function POST(request) {
    try {
        console.log('POST /api/customer - Attempting to connect to database...')
        await dbConnect()
        console.log('POST /api/customer - Database connected, creating customer...')
        
        const body = await request.json()
        console.log('POST /api/customer - Request body:', body)
        
        const customer = new Customer(body)
        const savedCustomer = await customer.save()
        console.log('POST /api/customer - Customer created:', savedCustomer._id)
        
        return NextResponse.json(savedCustomer, { status: 201 })
    } catch (error) {
        console.error('POST /api/customer - Error:', error)
        return NextResponse.json(
            { 
                error: 'Failed to create customer', 
                details: error.message,
                mongoURI: process.env.MONGODB_URI ? 'Configured' : 'Not configured'
            }, 
            { status: 500 }
        )
    }
}