$(document).ready(function() {
  // Cargar los eventos desde localStorage si existen
  var storedEvents = JSON.parse(localStorage.getItem('events')) || [];

  // Asegurarse de que todos los eventos tengan un _id único (incluyendo los antiguos)
  storedEvents = storedEvents.map(function(event) {
    if (!event._id) {
      event._id = new Date().getTime() + Math.random(); // Asignar un _id único si no existe
    }
    return event;
  });

  // Guardar los eventos actualizados con los _id únicos en localStorage
  localStorage.setItem('events', JSON.stringify(storedEvents));

  // Inicializar el calendario con los eventos almacenados
  $('#calendar').fullCalendar({
    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month'
    },
    locale: 'es', // Configura el idioma a español
    events: storedEvents, // Cargar los eventos desde el localStorage
    minTime: "08:00:00", // Limitar la vista a partir de las 08:00 AM
    maxTime: "17:00:00", // Limitar la vista hasta las 05:00 PM
    slotDuration: "00:30:00", // Intervalo de 30 minutos entre cada franja horaria
    allDaySlot: false, // No mostrar el slot de todo el día
    timeFormat: 'HH:mm', // Mostrar el horario en formato de 24 horas (HH:mm)
    eventRender: function(event, element) {
      // Personalizar cómo se muestran los eventos en el calendario
      element.find('.fc-title').append('<br><strong>Escuela:</strong> ' + event.escuela + '<br><strong>Docente:</strong> ' + event.docente);
      
      // Agregar botones de editar y eliminar
      var editButton = $('<button class="edit-btn">Editar</button>');
      var deleteButton = $('<button class="delete-btn">Eliminar</button>');
      element.append(editButton, deleteButton);

      // Función para eliminar el evento
      deleteButton.click(function() {
        if (confirm("¿Estás seguro de que deseas eliminar esta reunión?")) {
          // Eliminar el evento del calendario
          $('#calendar').fullCalendar('removeEvents', event._id);

          // Eliminar el evento de storedEvents usando el _id
          storedEvents = storedEvents.filter(function(e) {
            return e._id !== event._id; // Filtrar por el _id del evento
          });

          // Guardar los eventos actualizados en localStorage
          localStorage.setItem('events', JSON.stringify(storedEvents));
        }
      });

      // Función para editar el evento
      editButton.click(function() {
        // Rellenar el formulario con los datos actuales del evento
        $('#fecha').val(event.start.format('YYYY-MM-DD'));
        $('#hora').val(event.start.format('HH:mm'));
        $('#alumno').val(event.alumno);
        $('#escuela').val(event.escuela);
        $('#docente').val(event.docente);
        
        // Eliminar el evento actual del calendario (se actualizará)
        $('#calendar').fullCalendar('removeEvents', event._id);

        // Eliminar el evento de storedEvents
        storedEvents = storedEvents.filter(function(e) {
          return e._id !== event._id;
        });

        // Guardar los eventos actualizados en localStorage
        localStorage.setItem('events', JSON.stringify(storedEvents));
      });
    }
  });

  // Manejar el formulario de eventos
  $('#eventForm').submit(function(event) {
    event.preventDefault();

    // Obtener los valores del formulario
    var fecha = $('#fecha').val();
    var hora = $('#hora').val();
    var alumno = $('#alumno').val();
    var escuela = $('#escuela').val();
    var docente = $('#docente').val();

    // Crear un nuevo evento con un ID único
    var evento = {
      _id: new Date().getTime() + Math.random(), // Generar un identificador único usando el timestamp y un valor aleatorio
      title: alumno, // Título del evento será el nombre del alumno
      start: fecha + 'T' + hora, // La fecha y hora del evento
      allDay: false,
      alumno: alumno, // Guardar el nombre del alumno como dato adicional
      escuela: escuela, // Guardar la escuela como dato adicional
      docente: docente, // Guardar el docente como dato adicional
    };

    // Agregar el evento al calendario
    $('#calendar').fullCalendar('renderEvent', evento, true);

    // Agregar el evento a storedEvents
    storedEvents.push(evento);
    localStorage.setItem('events', JSON.stringify(storedEvents));

    // Reiniciar el formulario
    $('#eventForm')[0].reset();
  });
});
