const { google } = require('googleapis');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { name, email, phone, date, time } = JSON.parse(event.body);

    // Requerimos variables de entorno en Netlify
    // GOOGLE_SERVICE_ACCOUNT_EMAIL
    // GOOGLE_PRIVATE_KEY
    // GOOGLE_CALENDAR_ID
    const calendarId = process.env.GOOGLE_CALENDAR_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY ? process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n') : '';

    if (!calendarId || !clientEmail || !privateKey) {
      console.error("Missing Google Credentials");
      return { statusCode: 500, body: JSON.stringify({ error: "Configuración del servidor incompleta. Faltan variables de entorno." }) };
    }

    const auth = new google.auth.JWT(
      clientEmail,
      null,
      privateKey,
      ['https://www.googleapis.com/auth/calendar.events']
    );

    const calendar = google.calendar({ version: 'v3', auth });

    // date: "2024-05-15", time: "10:00" -> "2024-05-15T10:00:00-05:00" (Zona horaria Ecuador)
    const startDateTime = `${date}T${time}:00-05:00`;
    // Asumimos que la cita dura 1 hora.
    const endDate = new Date(new Date(startDateTime).getTime() + 60 * 60 * 1000);
    
    const eventDetails = {
      summary: `Cita: ${name}`,
      description: `Nombre: ${name}\nEmail: ${email}\nTeléfono: ${phone}`,
      start: {
        dateTime: startDateTime,
        timeZone: 'America/Guayaquil',
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: 'America/Guayaquil',
      },
      attendees: [
        { email: email }
      ],
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 24 * 60 },
          { method: 'popup', minutes: 60 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: calendarId,
      resource: eventDetails,
      sendUpdates: 'all' // Envía un correo de invitación al paciente
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Reserva exitosa", eventLink: response.data.htmlLink }),
    };
  } catch (error) {
    console.error("Error creating calendar event", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error al crear la cita en el calendario." }),
    };
  }
};
