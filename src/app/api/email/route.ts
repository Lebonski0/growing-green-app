import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, plants, partner, answers } = body;

    // Validate inputs server-side
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 });
    }

    const trimmedEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if (!plants || !Array.isArray(plants) || plants.length === 0) {
      return NextResponse.json({ error: 'No plant data provided.' }, { status: 400 });
    }

    const mainPlant = plants[0];
    const otherPlants = plants.slice(1);

    // Build the HTML email — all string interpolations are plain variables, no nested template literals
    const gardenType = answers?.gardenType || 'N/A';
    const climateZone = answers?.climateZone || 'N/A';
    const sunExposure = answers?.sunExposure || 'N/A';
    const plotSize = answers?.plotSize || 'N/A';
    const scientificNameHtml = mainPlant.scientificName
      ? `<p style="font-style: italic; color: #37613A; font-size: 14px; margin-top: 0;">${mainPlant.scientificName}</p>`
      : '';
    const bestPracticesHtml = Array.isArray(mainPlant.bestPractices) && mainPlant.bestPractices.length > 0
      ? mainPlant.bestPractices.map((bp: string) => `<li>${bp}</li>`).join('')
      : '<li>Follow standard watering and care guidelines.</li>';
    const whenToPlantHtml = mainPlant.whenToPlant
      ? `<strong>When to plant:</strong> ${mainPlant.whenToPlant}<br/>`
      : '';
    const howToStartHtml = mainPlant.howToStart
      ? `<strong>How to start:</strong> ${mainPlant.howToStart}`
      : '';
    const otherPlantsHtml = otherPlants.length > 0
      ? `<h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin-bottom: 16px; border-bottom: 2px solid #D3DED5; padding-bottom: 8px;">Also Consider</h2>
         <div style="gap: 12px; margin-bottom: 32px;">
           ${otherPlants.map((p: any) => {
             const tagBadge = p.tags?.[0] ? `<span style="background: #D3DED5; padding: 2px 8px; border-radius: 12px; font-size: 11px; margin-right: 8px;">${p.tags[0]}</span>` : '';
             const whenHtml = p.whenToPlant ? `Plant in ${p.whenToPlant}` : '';
             return `<div style="background: #FFFFFF; border: 1px solid #EAEAEA; border-radius: 8px; padding: 12px; margin-bottom: 8px;">
               <h4 style="margin: 0 0 4px 0; font-size: 16px;">${p.name}</h4>
               <p style="margin: 0; font-size: 13px; color: #555555;">${tagBadge}${whenHtml}</p>
             </div>`;
           }).join('')}
         </div>`
      : '';
    const partnerHtml = partner
      ? `<h2 style="font-family: 'Playfair Display', Georgia, serif; font-size: 22px; margin-bottom: 16px; border-bottom: 2px solid #D3DED5; padding-bottom: 8px;">Find Your Materials</h2>
         <div style="background: #CAF5A6; border-radius: 12px; padding: 16px; color: #052107;">
           <p style="font-size: 12px; font-weight: bold; text-transform: uppercase; margin: 0 0 4px 0;">Material / Resource</p>
           <h3 style="margin: 0 0 4px 0; font-size: 18px;">${partner.name}</h3>
           <p style="margin: 0; font-size: 14px;">📍 ${partner.location}</p>
         </div>`
      : '';

    const htmlContent = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"/></head>
<body style="margin: 0; padding: 20px; background: #F4F6F4;">
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #052107; background: #FAFAFA; border-radius: 16px; overflow: hidden; border: 1px solid #EAEAEA;">
    
    <div style="background-color: #052107; padding: 40px 32px; text-align: center;">
      <h1 style="font-family: Georgia, serif; color: #FFFFFF; margin: 0; font-size: 28px; font-weight: 700;">Green Garden 🌿</h1>
      <p style="color: #CAF5A6; font-size: 16px; margin-top: 8px; margin-bottom: 0;">Your personalized garden plan</p>
    </div>

    <div style="padding: 32px;">
      
      <div style="background: #F0F5F1; border-radius: 12px; padding: 16px; margin-bottom: 32px;">
        <h2 style="font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: #37613A; margin-top: 0; margin-bottom: 12px;">Your Garden Profile</h2>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">
          <strong>Garden type:</strong> ${gardenType} &middot; 
          <strong>Climate:</strong> ${climateZone} &middot; 
          <strong>Sun:</strong> ${sunExposure} &middot; 
          <strong>Size:</strong> ${plotSize}
        </p>
      </div>

      <h2 style="font-family: Georgia, serif; font-size: 22px; margin-bottom: 16px; border-bottom: 2px solid #D3DED5; padding-bottom: 8px;">Your Top Recommendation</h2>
      <div style="margin-bottom: 32px;">
        <h3 style="font-size: 20px; color: #052107; margin-bottom: 4px;">${mainPlant.name}</h3>
        ${scientificNameHtml}
        <p style="font-size: 15px; line-height: 1.6; color: #333333;">${mainPlant.description}</p>
        <div style="background: #FFFFFF; border: 1px solid #D3DED5; border-radius: 8px; padding: 16px; margin-top: 16px;">
          <h4 style="margin-top: 0; margin-bottom: 12px; color: #052107; font-size: 15px;">Best Practices:</h4>
          <ol style="margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.6; color: #333333;">
            ${bestPracticesHtml}
          </ol>
          <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #F0F5F1; font-size: 14px; color: #37613A;">
            ${whenToPlantHtml}
            ${howToStartHtml}
          </div>
        </div>
      </div>

      ${otherPlantsHtml}
      ${partnerHtml}

    </div>

    <div style="background-color: #E8EFE9; padding: 24px 32px; text-align: center; border-top: 1px solid #D3DED5;">
      <p style="font-size: 12px; color: #37613A; margin-top: 0; margin-bottom: 8px; line-height: 1.5;">
        🔒 Your privacy matters. Green Garden deleted all your session data the moment this email was sent. We store nothing.
      </p>
      <p style="font-size: 11px; color: #777777; margin: 0;">
        Generated at the Hopamine Green Hackathon &middot; June 2026
      </p>
    </div>

  </div>
</body>
</html>`;

    const response = await resend.emails.send({
      from: 'Green Garden <onboarding@resend.dev>',
      to: trimmedEmail,
      subject: '🌱 Your Green Garden Plan is Ready',
      html: htmlContent,
    });

    if (response.error) {
      console.error('Resend Error:', response.error);
      // Parse Resend-specific errors into user-friendly messages
      const code = (response.error as any)?.statusCode || (response.error as any)?.status;
      if (code === 403 || code === 422) {
        return NextResponse.json(
          { error: 'During the hackathon, emails can only be sent to the verified address (oskarcoding1@gmail.com). Please use that address.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Could not send email. Please try again later.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email API Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
}
