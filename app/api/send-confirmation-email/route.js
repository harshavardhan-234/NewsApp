import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/mailer';
import { connectToDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { name, email, phone, plan, paymentMethod } = await request.json();

    // Validate required fields
    if (!name || !email || !plan) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Connect to database to verify user exists
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Get plan details
    const planDetails = getPlanDetails(plan);
    
    // Generate HTML content for the email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #0070f3;">Subscription Confirmation</h1>
        </div>
        
        <p>Hello <strong>${name}</strong>,</p>
        
        <p>Thank you for subscribing to our service! Your payment has been successfully processed.</p>
        
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Subscription Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Plan:</strong> ${plan} Month(s)</p>
          <p><strong>Amount:</strong> ${planDetails.amount}</p>
          <p><strong>Payment Method:</strong> ${paymentMethod}</p>
          <p><strong>Subscription Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Expiry Date:</strong> ${getExpiryDate(plan)}</p>
        </div>
        
        <p>Your account has been created with the following credentials:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Password:</strong> ${user.temporaryPassword || 'Your chosen password'}</p>
        </div>
        
        <p>If you didn't set a password during registration, you can use the temporary password above to log in. We recommend changing it after your first login.</p>
        
        <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
          <p>Thank you for choosing our service!</p>
          <p>&copy; ${new Date().getFullYear()} News Portal. All rights reserved.</p>
        </div>
      </div>
    `;

    // Send the confirmation email
    const emailResult = await sendEmail({
      to: email,
      subject: 'Subscription Confirmation - News Portal',
      html: htmlContent,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { success: false, message: 'Failed to send email', error: emailResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully',
    });

  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error', error: error.message },
      { status: 500 }
    );
  }
}

// Helper function to get plan details
function getPlanDetails(plan) {
  const planMap = {
    '1': { amount: '₹199' },
    '3': { amount: '₹499' },
    '6': { amount: '₹899' },
    '12': { amount: '₹1499' },
  };

  return planMap[plan] || { amount: 'Custom amount' };
}

// Helper function to calculate expiry date
function getExpiryDate(plan) {
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + parseInt(plan));
  return expiryDate.toLocaleDateString();
}