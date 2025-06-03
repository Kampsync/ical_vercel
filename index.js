import { writeFileSync } from 'fs'
import { format } from 'date-fns'

export default async function handler(req, res) {
  const now = new Date()
  const calendarData = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//KampSync//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTAMP:${format(now, "yyyyMMdd'T'HHmmss'Z'")}
UID:unique-id@example.com
DTSTART:${format(now, "yyyyMMdd")}
DTEND:${format(new Date(now.getTime() + 86400000), "yyyyMMdd")}
SUMMARY:Sample Booking
DESCRIPTION:This is a sample event.
END:VEVENT
END:VCALENDAR`
  res.setHeader('Content-Type', 'text/calendar')
  res.send(calendarData)
}
