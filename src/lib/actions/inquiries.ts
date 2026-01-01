'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const inquirySchema = z.object({
    company_name: z.string().optional(),
    person_name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    inquiry_type: z.string().min(1, 'Inquiry type is required'),
    product_category: z.string().optional(),
    message: z.string().min(1, 'Message is required'),
});

export async function createInquiry(formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        company_name: formData.get('company_name'),
        person_name: formData.get('person_name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        inquiry_type: formData.get('inquiry_type'),
        product_category: formData.get('product_category'),
        message: formData.get('message'),
    };

    // Validation
    const validatedFields = inquirySchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            success: false,
            error: validatedFields.error.flatten().fieldErrors,
            message: 'Validation failed'
        };
    }

    // Insert into DB
    const { error } = await supabase
        .from('inquiries')
        .insert(validatedFields.data);

    if (error) {
        console.error('Error creating inquiry:', error);
        return {
            success: false,
            message: 'Failed to submit inquiry. Please try again.'
        };
    }

    // Send Email
    try {
        const nodemailer = require('nodemailer');

        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT || '587'),
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false // Optional: depending on server strictness
            }
        });

        // Content for the email
        const mailOptions = {
            from: process.env.MAIL_FROM,
            to: process.env.MAIL_TO,
            subject: `[New Inquiry] ${rawData.inquiry_type} - ${rawData.person_name}`,
            text: `
        New Inquiry Received:
        
        Company: ${rawData.company_name}
        Name: ${rawData.person_name}
        Email: ${rawData.email}
        Phone: ${rawData.phone}
        Type: ${rawData.inquiry_type}
        Category: ${rawData.product_category}
        
        Message:
        ${rawData.message}
      `,
            html: `
        <h2>New Inquiry Received</h2>
        <ul>
          <li><strong>Company:</strong> ${rawData.company_name}</li>
          <li><strong>Name:</strong> ${rawData.person_name}</li>
          <li><strong>Email:</strong> ${rawData.email}</li>
          <li><strong>Phone:</strong> ${rawData.phone}</li>
          <li><strong>Type:</strong> ${rawData.inquiry_type}</li>
          <li><strong>Category:</strong> ${rawData.product_category}</li>
        </ul>
        <h3>Message:</h3>
        <p style="white-space: pre-wrap;">${rawData.message}</p>
      `
        };

        await transporter.sendMail(mailOptions);

    } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // We don't fail the whole request if email fails, because DB insert succeeded.
        // Ideally we should alert admin or retry, but for now we just log it.
    }

    return {
        success: true,
        message: 'Inquiry submitted successfully'
    };
}
