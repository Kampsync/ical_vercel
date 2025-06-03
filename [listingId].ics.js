import { writeFileSync } from 'fs';
import ical from 'ical-generator';
import axios from 'axios';

export default async function handler(req, res) {
  const { listingId } = req.query;
  const apiBaseUrl = process.env.XANO_API_BASE_URL;
  const apiKey = process.env.XANO_API_KEY;

  if (!listingId || !apiBaseUrl || !apiKey) {
    return res.status(400).send('Missing required parameters or config');
  }

  try {
    const { data: bookings } = await axios.get(`${apiBaseUrl}`, {
      params: { listing_id: listingId },
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const calendar = ical({ name: `KampSync Listing ${listingId}` });

    bookings.forEach((booking) => {
      calendar.createEvent({
        start: new Date(booking.start_date),
        end: new Date(booking.end_date),
        summary: booking.summary || 'booking',
        description: booking.description || '',
        location: booking.location || '',
        uid: booking.id.toString(),
      });
    });

    res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="listing_${listingId}.ics"`);
    res.setHeader('Cache-Control', 'no-cache');
    res.status(200).send(calendar.toString());
  } catch (err) {
    console.error('Calendar generation failed:', err.message || err);
    res.status(500).send('Failed to generate calendar');
  }
}
