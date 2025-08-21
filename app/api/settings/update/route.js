import connectDB from '@/lib/db';
import Setting from '@/models/setting';
import { writeFile } from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { NextResponse } from 'next/server';

export async function PUT(req) {
  await connectDB();

  try {
    const formData = await req.formData();
    const siteTitle = formData.get('siteTitle');
    const contactEmail = formData.get('contactEmail');
    const contactPhone = formData.get('contactPhone');
    const footerText = formData.get('footerText');
    const facebook = formData.get('facebook');
    const instagram = formData.get('instagram');
    const linkedin = formData.get('linkedin');

    const logoFile = formData.get('logo');
    let logo = '';

    if (logoFile && logoFile.size > 0) {
      const bytes = await logoFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const fileName = uuidv4() + '_' + logoFile.name;
      const filePath = path.join(process.cwd(), 'public/uploads', fileName);
      await writeFile(filePath, buffer);
      logo = '/uploads/' + fileName;
    }

    const update = {
      siteTitle,
      contactEmail,
      contactPhone,
      footerText,
      facebook,
      instagram,
      linkedin,
    };

    if (logo) {
      update.logo = logo;
    }

    let setting = await Setting.findOne();
    if (setting) {
      await Setting.findByIdAndUpdate(setting._id, update);
    } else {
      setting = await Setting.create(update);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Setting update error:', error);
    return NextResponse.json({ success: false, message: 'Failed to update settings' }, { status: 500 });
  }
}
