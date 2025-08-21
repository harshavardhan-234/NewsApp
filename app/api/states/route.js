import connectDB from '@/lib/db';
import State from '@/models/state';

export async function GET(req) {
  await connectDB();
  const url = new URL(req.url);
  const countryId = url.searchParams.get('countryId');

  let query = {};
  if (countryId) query.countryId = countryId;

  const states = await State.find(query);
  return Response.json(states);
}
