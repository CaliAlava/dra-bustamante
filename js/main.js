/* =========================================================
   Dra. Maria Paula Bustamante — interactions
   ========================================================= */

(() => {
  const nav = document.getElementById('nav');
  const burger = document.getElementById('burger');
  const drawer = document.getElementById('drawer');

  // --- Sticky nav background on scroll ---
  const onScroll = () => {
    if (window.scrollY > 24) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile drawer ---
  const closeDrawer = () => {
    burger.classList.remove('is-open');
    drawer.classList.remove('is-open');
    document.body.style.overflow = '';
  };
  burger.addEventListener('click', () => {
    const open = burger.classList.toggle('is-open');
    drawer.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

  // --- Revelación de elementos al hacer scroll (Intersection Observer) ---
  // Añade la clase 'is-in' a los elementos con '.reveal' cuando entran al viewport
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // --- Efecto Parallax sutil en la imagen del Hero ---
  // Solo se activa en pantallas grandes para no afectar rendimiento móvil
  const heroImg = document.querySelector('.hero__media img');
  if (heroImg && window.matchMedia('(min-width: 768px)').matches) {
    let raf = null;
    window.addEventListener('scroll', () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y < window.innerHeight) {
          heroImg.style.transform = `scale(1) translateY(${y * 0.18}px)`;
        }
        raf = null;
      });
    }, { passive: true });
  }

  // --- Calendario e Interacciones ---
  const calPrev = document.getElementById('cal-prev');
  const calNext = document.getElementById('cal-next');
  const calMonthYear = document.getElementById('cal-month-year');
  const calDays = document.getElementById('cal-days');
  const slotsDate = document.getElementById('slots-date');
  const slotsContainer = document.getElementById('slots-container');

  if (calDays) {
    let currentDate = new Date();
    currentDate.setDate(1);
    
    let selectedDate = null;
    let reservations = JSON.parse(localStorage.getItem('draBustamanteReservations')) || {};

    const saveReservations = () => {
      localStorage.setItem('draBustamanteReservations', JSON.stringify(reservations));
    };

    const isReserved = (dateStr, time) => {
      return reservations[dateStr] && reservations[dateStr].includes(time);
    };

    const reserveSlot = (dateStr, time) => {
      if (!reservations[dateStr]) reservations[dateStr] = [];
      reservations[dateStr].push(time);
      saveReservations();
    };

    const renderCalendar = () => {
      calDays.innerHTML = '';
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      calMonthYear.textContent = `${monthNames[month]} ${year}`;
      
      const firstDay = new Date(year, month, 1).getDay(); // 0 is Sun, 1 is Mon...
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Ajustar para que la semana empiece el Lunes
      const startDayIndex = firstDay === 0 ? 6 : firstDay - 1;
      
      const today = new Date();
      today.setHours(0,0,0,0);

      // Celdas vacías iniciales
      for (let i = 0; i < startDayIndex; i++) {
        const div = document.createElement('div');
        div.className = 'cal-day empty';
        calDays.appendChild(div);
      }
      
      // Días del mes
      for (let d = 1; d <= daysInMonth; d++) {
        const dateObj = new Date(year, month, d);
        const dayOfWeek = dateObj.getDay();
        
        // Compensamos la diferencia horaria local usando las partes de fecha:
        const yStr = dateObj.getFullYear();
        const mStr = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dStr = String(dateObj.getDate()).padStart(2, '0');
        const dateStr = `${yStr}-${mStr}-${dStr}`;
        
        const div = document.createElement('div');
        div.className = 'cal-day';
        div.textContent = d;
        
        if (dateObj < today || dayOfWeek === 0) {
          // Deshabilitar días pasados o domingos
          div.classList.add('disabled');
        } else {
          if (dayOfWeek === 6) div.classList.add('saturday');
          
          if (selectedDate && `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` === dateStr) {
            div.classList.add('selected');
          }
          
          div.addEventListener('click', () => {
            document.querySelectorAll('.cal-day.selected').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            selectedDate = dateObj;
            renderSlots(dateObj);
            document.querySelector('.agenda__container').classList.add('has-selection');
          });
        }
        
        calDays.appendChild(div);
      }
    };
    
    const renderSlots = (dateObj) => {
      slotsContainer.innerHTML = '';
      const dayOfWeek = dateObj.getDay();
      
      const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
      const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
      const dateStrFormat = `${dayNames[dayOfWeek]} ${dateObj.getDate()} de ${monthNames[dateObj.getMonth()]}`;
      const yStr = dateObj.getFullYear();
      const mStr = String(dateObj.getMonth() + 1).padStart(2, '0');
      const dStr = String(dateObj.getDate()).padStart(2, '0');
      const dateStrId = `${yStr}-${mStr}-${dStr}`;
      
      slotsDate.textContent = dateStrFormat;
      
      if (dayOfWeek === 6) {
        // Sábado
        slotsContainer.innerHTML = `
          <div class="slots__saturday-msg">
            <p>Únicamente los sábados anunciados.</p>
            <p>Para confirmar disponibilidad o agendar, por favor comuníquese directamente.</p>
            <a href="https://api.whatsapp.com/send/?phone=593994495015&text=Hola%21%20Quisiera%20consultar%20disponibilidad%20para%20un%20s%C3%A1bado." target="_blank" rel="noopener" class="btn btn--primary">
              <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true" style="margin-right: 8px;"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
              Consultar por WhatsApp
            </a>
          </div>
        `;
        return;
      }
      
      // Lunes a Viernes (10:00 - 19:00 -> 10:00 a 18:00 slots)
      const hours = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];
      
      hours.forEach(time => {
        const btn = document.createElement('button');
        btn.className = 'slot-btn';
        btn.textContent = time;
        
        if (isReserved(dateStrId, time)) {
          btn.disabled = true;
          btn.textContent += ' (Reservado)';
        }
        
        btn.addEventListener('click', () => {
          document.querySelectorAll('.slot-btn.selected').forEach(el => el.classList.remove('selected'));
          btn.classList.add('selected');
        });
        
        slotsContainer.appendChild(btn);
      });
      
      const actionDiv = document.createElement('div');
      actionDiv.className = 'slots__action';
      const confirmBtn = document.createElement('button');
      confirmBtn.className = 'btn btn--primary';
      confirmBtn.textContent = 'Confirmar reserva';
      confirmBtn.addEventListener('click', () => {
        const selectedSlot = document.querySelector('.slot-btn.selected');
        if (selectedSlot) {
          const time = selectedSlot.textContent;
          reserveSlot(dateStrId, time);
          alert(`Reserva confirmada para el ${dateStrFormat} a las ${time}`);
          renderSlots(dateObj); // Refrescar para deshabilitar
        } else {
          alert('Por favor selecciona un horario.');
        }
      });
      
      actionDiv.appendChild(confirmBtn);
      slotsContainer.appendChild(actionDiv);
    };

    calPrev.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
    
    calNext.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });

    renderCalendar();
  }
})();
