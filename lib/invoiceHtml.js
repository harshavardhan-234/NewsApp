export function generateHtmlInvoice({ name, email, phone, plan, paymentId }) {
  const date = new Date().toLocaleString();

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial; padding: 20px; }
          .header { font-size: 22px; font-weight: bold; margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; }
          td, th { border: 1px solid #ddd; padding: 8px; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <div class="header">Subscription Invoice</div>
        <table>
          <tr><th>Name</th><td>${name}</td></tr>
          <tr><th>Email</th><td>${email}</td></tr>
          <tr><th>Phone</th><td>${phone}</td></tr>
          <tr><th>Plan</th><td>${plan} month(s)</td></tr>
          <tr><th>Payment ID</th><td>${paymentId}</td></tr>
          <tr><th>Date</th><td>${date}</td></tr>
        </table>
        <p>Thank you for subscribing to our premium service.</p>
      </body>
    </html>
  `;
}
