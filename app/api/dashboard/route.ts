import { google } from "googleapis";
import { NextResponse } from "next/server";

const auth = new google.auth.JWT({
  email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
  key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
});

const sheets = google.sheets({ version: "v4", auth });
const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

export async function GET() {
  try {
    const response = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges: ["Dashboard!B6:P8", "Dashboard!B20:J30"],
    });

    const [headlineRange, articlesRange] = response.data.valueRanges ?? [];

    return NextResponse.json({
      headlineRaw: headlineRange?.values ?? [],
      articlesRaw: articlesRange?.values ?? [],
    });
  } catch (error) {
    console.error("Sheets API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}