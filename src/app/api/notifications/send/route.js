import { NextResponse } from "next/server";
import webpush from "web-push";

// Configure web-push (you'll need to set these environment variables)
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    'mailto:admin@raceready.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

// In-memory storage (same as subscribe route - use shared database in production)
const subscriptions = new Map();

export async function POST(request) {
  try {
    const { title, body, url, tag, siteSlug, targetSites } = await request.json();

    if (!title || !body) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    // Determine which subscriptions to send to
    const targetSubscriptions = [];
    
    for (const [key, data] of subscriptions.entries()) {
      const shouldSend = targetSites 
        ? targetSites.includes(data.siteSlug)
        : !siteSlug || data.siteSlug === siteSlug;
        
      if (shouldSend) {
        targetSubscriptions.push(data.subscription);
      }
    }

    if (targetSubscriptions.length === 0) {
      return NextResponse.json(
        { error: "No subscriptions found for target sites" },
        { status: 404 }
      );
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      tag: tag || 'race-update',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-72x72.png',
      vibrate: [200, 100, 200],
      data: {
        url: url || '/',
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'view',
          title: 'View Update',
          icon: '/icons/action-view.png'
        },
        {
          action: 'dismiss',
          title: 'Dismiss',
          icon: '/icons/action-dismiss.png'
        }
      ]
    });

    // Send notifications
    const results = await Promise.allSettled(
      targetSubscriptions.map(subscription => 
        webpush.sendNotification(subscription, payload)
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;

    console.log(`🏁 Sent ${successful} notifications, ${failed} failed`);

    return NextResponse.json({
      success: true,
      sent: successful,
      failed: failed,
      total: targetSubscriptions.length
    });

  } catch (error) {
    console.error("Failed to send push notifications:", error);
    return NextResponse.json(
      { error: "Failed to send notifications" },
      { status: 500 }
    );
  }
}

// Test endpoint for development
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }

  // Send test notification to all subscriptions
  const testPayload = JSON.stringify({
    title: '🏁 RaceReady Test',
    body: 'This is a test notification from your racing app!',
    url: '/events',
    tag: 'test',
    icon: '/icons/icon-192x192.png'
  });

  const allSubscriptions = Array.from(subscriptions.values()).map(data => data.subscription);
  
  if (allSubscriptions.length === 0) {
    return NextResponse.json({ message: "No subscriptions to test" });
  }

  try {
    const results = await Promise.allSettled(
      allSubscriptions.map(subscription => 
        webpush.sendNotification(subscription, testPayload)
      )
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    
    return NextResponse.json({
      message: `Test notification sent to ${successful}/${allSubscriptions.length} subscribers`
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}



