
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AdmissionFormData {
  fullName: string;
  email: string;
  phone: string;
  parentName: string;
  address: string;
  currentSchool: string;
  grade: string;
  program: string;
  previousMarks?: string;
  howHeard: string;
  additionalInfo?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { formData } = await req.json() as { formData: AdmissionFormData };
    
    // Create a formatted email with the admission application data
    const emailContent = `
      <h1>New Admission Application</h1>
      
      <h2>Personal Information</h2>
      <p><strong>Full Name:</strong> ${formData.fullName}</p>
      <p><strong>Email:</strong> ${formData.email}</p>
      <p><strong>Phone:</strong> ${formData.phone}</p>
      <p><strong>Parent/Guardian:</strong> ${formData.parentName}</p>
      <p><strong>Address:</strong> ${formData.address}</p>
      
      <h2>Educational Information</h2>
      <p><strong>Current School/College:</strong> ${formData.currentSchool}</p>
      <p><strong>Current Grade/Class:</strong> ${formData.grade}</p>
      <p><strong>Program of Interest:</strong> ${formData.program}</p>
      <p><strong>Previous Marks:</strong> ${formData.previousMarks || "Not provided"}</p>
      
      <h2>Additional Information</h2>
      <p><strong>How they heard about us:</strong> ${formData.howHeard}</p>
      <p><strong>Additional Information:</strong> ${formData.additionalInfo || "Not provided"}</p>
    `;

    // Send email using Resend to the specified email address
    const emailResponse = await resend.emails.send({
      from: "Admission Application <onboarding@resend.dev>",
      to: ["harsh171517@gmail.com"],
      subject: `New Admission Application: ${formData.fullName}`,
      html: emailContent,
      reply_to: formData.email,
    });

    if (!emailResponse.data) {
      throw new Error(`Failed to send email: ${JSON.stringify(emailResponse.error)}`);
    }

    console.log("Email sent successfully:", emailResponse.data);

    return new Response(
      JSON.stringify({ success: true, message: "Application submitted successfully" }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in send-admission-email function:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || "Failed to process admission application" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
};

serve(handler);
