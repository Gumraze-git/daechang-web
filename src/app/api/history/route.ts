import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper to get the path to the JSON file
const getDataFilePath = () => {
  return path.join(process.cwd(), 'src', 'data', 'history.json');
};

export async function GET() {
  try {
    const filePath = getDataFilePath();
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
        // If not, return empty array
        return NextResponse.json([]);
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(fileContents);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error reading history data:', error);
    return NextResponse.json({ error: 'Failed to fetch history data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const filePath = getDataFilePath();

    // Ensure directory exists
    const dirPath = path.dirname(filePath);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    // Write data to file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'History data updated successfully' });
  } catch (error) {
    console.error('Error updating history data:', error);
    return NextResponse.json({ error: 'Failed to update history data' }, { status: 500 });
  }
}
