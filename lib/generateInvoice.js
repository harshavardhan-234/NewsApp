import puppeteer from 'puppeteer';

export async function generateInvoice({ name, email, phone, plan, paymentId }) {
  const htmlContent = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            padding: 40px;
            color: #333;
            background-color: #f9f9f9;
          }

          h1 {
            text-align: center;
            color: #0070f3;
            margin-bottom: 30px;
          }

          .invoice-box {
            background: white;
            padding: 30px;
            border: 1px solid #eee;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            max-width: 600px;
            margin: auto;
          }

          table {
            width: 100%;
            line-height: 1.6;
            border-collapse: collapse;
          }

          td {
            padding: 8px;
            border: 1px solid #ddd;
          }

          .label {
            background-color: #f2f2f2;
            font-weight: bold;
            width: 30%;
          }

          .value {
            width: 70%;
          }

          .footer {
            text-align: center;
            margin-top: 40px;
            font-size: 12px;
            color: #999;
          }
        </style>
      </head>
      <body>
        <div class="invoice-box">
          <h1>Subscription Invoice</h1>
          <table>
            <tr>
              <td class="label">Name</td>
              <td class="value">${name}</td>
            </tr>
            <tr>
              <td class="label">Email</td>
              <td class="value">${email}</td>
            </tr>
            <tr>
              <td class="label">Phone</td>
              <td class="value">${phone}</td>
            </tr>
            <tr>
              <td class="label">Plan</td>
              <td class="value">${plan} month(s)</td>
            </tr>
           
            <tr>
              <td class="label">Date</td>
              <td class="value">${new Date().toLocaleString()}</td>
            </tr>
          </table>
          <div class="footer">
            © ${new Date().getFullYear()} GNews. All rights reserved.
          </div>
        </div>
      </body>
    </html>
  `;

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox'],
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'load' });

  const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

  await browser.close();
  return pdfBuffer;
}
