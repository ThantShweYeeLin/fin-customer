import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Customer from "@/models/Customer";

// GET - Read single customer by ID
export async function GET(request, { params }) {
  try {
    await connectDB();
    const customer = await Customer.findById(params.id);
    
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer", details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update customer
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Check if member number already exists for different customer
    if (body.memberNumber) {
      const existingCustomer = await Customer.findOne({ 
        memberNumber: body.memberNumber,
        _id: { $ne: params.id }
      });
      if (existingCustomer) {
        return NextResponse.json(
          { error: "Member number already exists" },
          { status: 400 }
        );
      }
    }

    const customer = await Customer.findByIdAndUpdate(
      params.id,
      body,
      { new: true, runValidators: true }
    );
    
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update customer" },
      { status: 500 }
    );
  }
}

// DELETE - Delete customer
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const customer = await Customer.findByIdAndDelete(params.id);
    
    if (!customer) {
      return NextResponse.json(
        { error: "Customer not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: "Customer deleted successfully",
      deletedCustomer: customer
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete customer" },
      { status: 500 }
    );
  }
}