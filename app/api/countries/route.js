import connectDB from '@/lib/mongodb';
import Country from '@/models/Country';

export async function POST(req) {
  try {
    await connectDB();
    const { countryName } = await req.json();

    if (!countryName) {
      return Response.json({ message: 'Missing countryName' }, { status: 400 });
    }

    // Check for duplicates before inserting
    const existing = await Country.findOne({ countryName });
    if (existing) {
      return Response.json({ message: 'Country already exists' }, { status: 400 });
    }

    const newCountry = await Country.create({ countryName });
    return Response.json({ message: 'Country added successfully', data: newCountry });
    
  } catch (error) {
    console.error('Error adding country:', error);
    return Response.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
