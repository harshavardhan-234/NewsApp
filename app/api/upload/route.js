import { IncomingForm } from 'formidable';
import { Readable } from 'stream';
import path from 'path';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

function toNodeReadable(webReadable) {
  const reader = webReadable.getReader();

  return new Readable({
    async read() {
      const { done, value } = await reader.read();
      if (done) this.push(null);
      else this.push(value);
    },
  });
}

function parseForm(req) {
  return new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: path.join(process.cwd(), '/public/uploads'),
      keepExtensions: true,
    });

    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });
}

export async function POST(request) {
  try {
    const nodeReq = toNodeReadable(request.body);
    nodeReq.headers = Object.fromEntries(request.headers);
    nodeReq.method = request.method;

    const { fields, files } = await parseForm(nodeReq);
    const uploadedFile = files.image[0]; // "image" is the field name
    const imageUrl = `/uploads/${path.basename(uploadedFile.filepath)}`;

    return Response.json({ success: true, url: imageUrl });
  } catch (err) {
    console.error(err);
    return Response.json({ success: false, message: err.message }, { status: 500 });
  }
}
