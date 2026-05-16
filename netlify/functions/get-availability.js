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

    const response = await calendar.freebusy.query({
      requestBody: {
        timeMin: timeMin,
        timeMax: timeMax,
        timeZone: 'America/Guayaquil',
        items: [{ id: calendarId }]
      }
    });

    const calendars = response.data.calendars || {};
    const calendarData = calendars[calendarId] || {};
    const busyPeriods = calendarData.busy || [];
    
    const allSlots = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
    const busySlots = [];

    // Validar cada hora contra los periodos ocupados
    allSlots.forEach(slot => {
      const slotStartStr = `${date}T${slot}:00-05:00`;
      const slotStart = new Date(slotStartStr).getTime();
      
      // Asumimos que cada cita dura 1 hora
      const slotEnd = slotStart + 60 * 60 * 1000;
      
      // Verificar si este horario se solapa con algún periodo ocupado
      const isOverlapping = busyPeriods.some(period => {
        const busyStart = new Date(period.start).getTime();
        const busyEnd = new Date(period.end).getTime();
        
        // Se solapan si: Inicio de A < Fin de B Y Fin de A > Inicio de B
        return slotStart < busyEnd && slotEnd > busyStart;
      });
      
      if (isOverlapping) {
        busySlots.push(slot);
      }
    });

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
