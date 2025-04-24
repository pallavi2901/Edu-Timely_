const { google } = require('googleapis');
const calendar = google.calendar('v3');

const getEvents = async (auth) => {
  const calendarAPI = google.calendar({ version: 'v3', auth });
  const res = await calendarAPI.events.list({ calendarId: 'primary' });
  return res.data.items;
};

module.exports = { getEvents };
