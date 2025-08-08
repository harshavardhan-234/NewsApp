import connectDB from '@/lib/mongodb';
import City from '@/models/city';

export async function GET() {
  await connectDB();
  const cities = await City.find();
  return Response.json(cities);
}

export async function POST(req) {
  await connectDB();
  const { cityName, stateId } = await req.json();
  if (!cityName || !stateId) {
    return Response.json({ message: 'Missing cityName or stateId' }, { status: 400 });
  }
  const newCity = await City.create({ cityName, stateId });
  return Response.json(newCity);
}
    