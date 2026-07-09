import { NextRequest, NextResponse } from "next/server";
import { estimateTaxSavings } from "@/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { income } = await request.json();

    if (!income || income < 0) {
      return NextResponse.json(
        { error: "Invalid income amount" },
        { status: 400 }
      );
    }

    const analysis = await estimateTaxSavings(income);

    return NextResponse.json({
      income,
      analysis,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
