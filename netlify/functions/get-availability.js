const { google } = require('googleapis');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const date = event.queryStringParameters.date; // e.g., "2024-05-15"
    if (!date) {
      return { statusCode: 400, body: JSON.stringify({ error: "Falta el parámetro de fecha (date)" }) };
    }

    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    let privateKey = process.env.GOOGLE_PRIVATE_KEY || '';
    privateKey = privateKey.replace(/\\n/g, '\n').replace(/^"|"$/g, '').trim();

    if (!calendarId || !clientEmail || !privateKey) {
      console.error("Missing Google Credentials");
      return { statusCode: 500, body: JSON.stringify({ error: "Configuración del servidor incompleta." }) };
    }

    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: ['https://www.googleapis.com/auth/calendar.readonly']
    });

    const calendar = google.calendar({ version: 'v3', auth });

    // Definir el inicio y fin del día en la zona horaria de Ecuador (UTC-5)
    const timeMin = `${date}T00:00:00-05:00`;
    const timeMax = `${date}T23:59:59-05:00`;

    const response = await calendar.events.list({
      calendarId: calendarId,
      timeMin: timeMin,
      timeMax: timeMax,
      timeZone: 'America/Guayaquil',
      singleEvents: true,
      orderBy: 'startTime'
    });

    const events = response.data.items || [];
    
    // Extraer las horas de los eventos. 
    // event.start.dateTime usualmente tiene el formato: "YYYY-MM-DDTHH:mm:ss-05:00"
    const busySlots = events.map(event => {
      if (event.start && event.start.dateTime) {
        const timePart = event.start.dateTime.split('T')[1];
        if (timePart) {
          return timePart.substring(0, 5); // Ej. "10:00"
        }
      }
      return null;
    }).filter(time => time !== null);

    return {
      statusCode: 200,
      body: JSON.stringify({ busySlots }),
    };
  } catch (error) {
    console.error("Error fetching availability", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al consultar la disponibilidad del calendario." }),
    };
  }
};
