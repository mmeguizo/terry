import { NextResponse } from "next/server";

// In-memory storage for demo (use database in production)
const subscriptions = new Map();

export async function POST(request) {
  try {
    const { subscription, siteSlug } = await request.json();
    
    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { error: "Invalid subscription data" },
        { status: 400 }
      );
    }

    // Store subscription with site slug
    const subscriptionKey = `${siteSlug || 'default'}-${subscription.endpoint}`;
    subscriptions.set(subscriptionKey, {
      subscription,
      siteSlug: siteSlug || 'default',
      subscribedAt: new Date().toISOString()
    });

    console.log(`🏁 New push subscription for ${siteSlug}:`, subscription.endpoint);

    return NextResponse.json({ 
      success: true,
      message: "Subscription saved successfully" 
    });

  } catch (error) {
    console.error("Failed to save push subscription:", error);
    return NextResponse.json(
      { error: "Failed to save subscription" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // Return subscription count for monitoring
  const siteStats = {};
  
  for (const [key, data] of subscriptions.entries()) {
    const site = data.siteSlug;
    siteStats[site] = (siteStats[site] || 0) + 1;
  }

  return NextResponse.json({
    totalSubscriptions: subscriptions.size,
    siteStats
  });
}



