// app/api/countries/route.js
import { connectDB } from '@/lib/db'
import Country from '@/models/Country'
import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    await connectDB()

    const { countryName } = await req.json()

    if (!countryName || countryName.trim() === '') {
      return NextResponse.json({ message: 'Country name is required' }, { status: 400 })
    }

    const newCountry = await Country.create({ name: countryName })

    return NextResponse.json({ message: 'Country added successfully', country: newCountry })
  } catch (error) {
    console.error('Error adding country:', error)
    return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 })
  }
}
