import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/Customer";

// GET - Read all customers
export async function GET() {
  try {
    await connectDB();
    const customers = await Customer.find({}).sort({ memberNumber: 1 });
    return NextResponse.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers", details: error.message },
      { status: 500 }
    );
  }
}

// POST - Create new customer
export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    
    console.log("Creating customer with data:", body);
    
    // Check if member number already exists
    const existingCustomer = await Customer.findOne({ memberNumber: body.memberNumber });
    if (existingCustomer) {
      return NextResponse.json(
        { error: "Member number already exists" },
        { status: 400 }
      );
    }

    const customer = new Customer(body);
    const savedCustomer = await customer.save();
    console.log("Customer saved successfully:", savedCustomer);
    return NextResponse.json(savedCustomer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return NextResponse.json(
      { error: "Failed to create customer", details: error.message },
      { status: 500 }
    );
  }
}