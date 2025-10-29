# RaceReady GUID Setup Guide

## Overview

This guide explains how to add the `raceReadyGUID` field to your Strapi Site schema to enable RaceReady Events API integration.

## What is the RaceReady GUID?

The RaceReady GUID is a unique identifier that authenticates your site with the RaceReady Events API. Each site in your multi-tenant system should have its own GUID to access its specific event data.

## Strapi Schema Update

### Step 1: Add Field to Site Content Type

1. Log into your Strapi admin panel
2. Navigate to **Content-Type Builder**
3. Select the **Site** content type
4. Click **Add another field**
5. Choose **Text** field type
6. Configure the field:
   - **Name**: `raceReadyGUID`
   - **Type**: Short text
   - **Description**: "RaceReady API GUID for event data access"
   - **Default value**: (leave empty)
   - **Required**: No (optional, allows sites without RaceReady integration)
   - **Unique**: No
   - **Max length**: 100

7. Click **Finish** and then **Save**
8. Restart your Strapi server

### Step 2: Add GUIDs to Your Sites

For each site in your Strapi admin, add the corresponding GUID from your configuration:

| Site | Domain | RaceReady GUID |
|------|--------|----------------|
| Motor Racing Australia | motorrace.com.au | `84368220-881D-42A8-8B08-A38A4FE11A96` |
| SuperTT Championship | supertt.com.au | `[Your GUID]` |
| Clubman Championship | clubmanchampionship.com.au | `[Your GUID]` |
| MX5 Cup | mx5cup.com.au | `[Your GUID]` |
| ExtremeTT | extremett.com.au | `[Your GUID]` |
| Sydney 300 | sydney300.com.au | `[Your GUID]` |
| Wakefield 300 | wakefield300.com.au | `[Your GUID]` |
| Classic Sports Cars | classicsportscars.com.au | `[Your GUID]` |
| AMRC | amrc.com.au | `[Your GUID]` |

*Note: Replace `[Your GUID]` with the actual GUIDs from your Google Sheet*

### Step 3: Verify Integration

After adding the GUIDs:

1. Restart your Next.js application
2. Visit your homepage - the hero section should display next event data
3. Visit `/events` - should show all events from RaceReady
4. Click on an event - should show detailed event information

## API Endpoints

Once configured, these endpoints become available:

### Get Next Event
```
GET /api/raceready-events?view=next
```

Returns the next upcoming event for the current site.

### Get All Events
```
GET /api/raceready-events?view=events
```

Returns all events for the current site.

### Get Specific Event
```
GET /api/raceready-events?view=event&event=2025-round-1
```

Returns detailed information for a specific event by slug or ID.

## Fallback Configuration

If you don't want to add the field to Strapi immediately, you can use environment variables as a fallback:

```env
RACEREADY_GUID=84368220-881D-42A8-8B08-A38A4FE11A96
```

Add this to your `.env.local` file for each site deployment.

## Troubleshooting

### GUID Not Found Error

If you see "RaceReady GUID not configured for this site":

1. Check that the `raceReadyGUID` field exists in Strapi
2. Verify the GUID is correctly entered for your site
3. Ensure there are no extra spaces or characters
4. Restart your Next.js application

### No Events Returned

If the API returns no events:

1. Verify the GUID is correct
2. Test the RaceReady API directly:
   ```
   https://raceready.com.au/api/events/?GUID=YOUR-GUID&view=events
   ```
3. Check that events exist for your GUID in RaceReady
4. Review server logs for API errors

### Events Not Showing on Homepage

If events don't appear on the homepage:

1. Check browser console for errors
2. Verify `/api/raceready-events?view=next` returns data
3. Ensure the event has a valid `startDate` or `date` field
4. Check that the event data structure matches expected format

## Schema JSON (For Reference)

If you need to manually add the field to your Strapi schema JSON:

```json
{
  "kind": "collectionType",
  "collectionName": "sites",
  "info": {
    "singularName": "site",
    "pluralName": "sites",
    "displayName": "Site"
  },
  "attributes": {
    "raceReadyGUID": {
      "type": "string",
      "maxLength": 100,
      "description": "RaceReady API GUID for event data access"
    }
  }
}
```

Add this to your existing Site schema attributes.

## Benefits

Once configured, you'll have:

- ✅ **Dynamic event data** on homepage hero section
- ✅ **Automatic event listings** on `/events` page
- ✅ **Detailed event pages** at `/event/[slug]`
- ✅ **Entry status tracking** with "Enter Now" buttons
- ✅ **Real-time updates** from RaceReady system
- ✅ **Centralized event management** across all sites

## Support

For issues with:
- **Strapi configuration**: Check Strapi documentation
- **RaceReady API**: Contact RaceReady support
- **Integration code**: Review `/src/app/api/raceready-events/route.js`

