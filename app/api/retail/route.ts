import { google } from "googleapis";
import { NextResponse } from "next/server";
import { parseRetailRows } from "../../lib/retail-parser";
import type { RetailData } from "../../lib/retail-types";

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const RETAIL_ID = process.env.GOOGLE_SHEETS_RETAIL_ID;

export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: RETAIL_ID,
      // Read the whole data columns; parser drops empty buffer rows.
      // UNFORMATTED so we get raw numbers, not "1,342,611" strings.
      range: "Master Data!A2:K600",
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const rows = parseRetailRows(response.data.values ?? []);

    // Ordered, deduped month + outlet lists for filters
    const months = [...new Set(rows.map((r) => r.monthKey))]
      .sort()
      .map((key) => rows.find((r) => r.monthKey === key)!.month);
    const outlets = [...new Set(rows.map((r) => r.outlet))].sort();

    const data: RetailData = {
      rows,
      months,
      outlets,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error("Retail Sheets API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch retail data" },
      { status: 500 }
    );
  }
}