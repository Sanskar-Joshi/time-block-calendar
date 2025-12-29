let events = [];
let editingEventId = null;

function init() {
  // 1. Load data from LocalStorage
  const savedEvents = localStorage.getItem("calendarEvents");
  if (savedEvents) {
    events = JSON.parse(savedEvents);
  }

  updateDateDisplay();
  generateTimeSlots();
  renderEvents(); // Render saved events

  // Scroll to 8 AM initially
  const container = document.querySelector(".calendar-container");
  if (container) container.scrollTop = 120;

  setupEventListeners();
  updateCurrentTimeIndicator();
  setInterval(updateCurrentTimeIndicator, 60000);
}

function updateDateDisplay() {
  const now = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  document.getElementById("dateDisplay").textContent = now.toLocaleDateString(
    "en-US",
    options
  );
}

function generateTimeSlots() {
  const timeLabels = document.getElementById("timeLabels");
  const calendarBody = document.getElementById("calendarBody");

  // Generate form 6 AM to 11 PM
  for (let hour = 6; hour < 23; hour++) {
    const timeLabel = document.createElement("div");
    timeLabel.className = "time-label";
    timeLabel.textContent = formatTime(hour);
    timeLabels.appendChild(timeLabel);

    const timeSlot = document.createElement("div");
    timeSlot.className = "time-slot";
    timeSlot.dataset.hour = hour;
    timeSlot.addEventListener("click", () => openEventModal(hour));
    calendarBody.appendChild(timeSlot);
  }
}

function formatTime(hour) {
  if (hour === 0) return "12 AM";
  if (hour < 12) return `${hour} AM`;
  if (hour === 12) return "12 PM";
  return `${hour - 12} PM`;
}

function setupEventListeners() {
  document
    .getElementById("addEventBtn")
    .addEventListener("click", () => openEventModal());
  document
    .getElementById("todayBtn")
    .addEventListener("click", scrollToCurrentTime);
  document
    .getElementById("clearAllBtn")
    .addEventListener("click", clearAllEvents);
  document
    .getElementById("cancelBtn")
    .addEventListener("click", closeEventModal);

  document.getElementById("eventForm").addEventListener("submit", saveEvent);

  document.getElementById("eventModal").addEventListener("click", (e) => {
    if (e.target.id === "eventModal") closeEventModal();
  });

  document.getElementById("deleteEventBtn").addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (editingEventId) {
      if (confirm("Are you sure you want to delete this event?")) {
        deleteEvent(editingEventId);
        setTimeout(() => closeEventModal(), 50);
      }
    }
  });
}

function openEventModal(hour = null, event = null) {
  const modal = document.getElementById("eventModal");
  const modalTitle = document.getElementById("modalTitle");
  const eventTitle = document.getElementById("eventTitle");
  const eventStart = document.getElementById("eventStart");
  const eventEnd = document.getElementById("eventEnd");
  const deleteBtn = document.getElementById("deleteEventBtn");

  if (event) {
    modalTitle.textContent = "Edit Event";
    eventTitle.value = event.title;
    eventStart.value = event.startTime;
    eventEnd.value = event.endTime;

    // Show Delete Button
    deleteBtn.style.display = "block";

    const colorRadio = document.querySelector(
      `input[name="eventColor"][value="${event.color}"]`
    );

    if (colorRadio) colorRadio.checked = true;

    editingEventId = event.id;
  } else {
    modalTitle.textContent = "Add New Event";
    eventTitle.value = "";
    deleteBtn.style.display = "none";

    // Default time logic
    const startH = hour !== null ? hour : 9;
    eventStart.value = `${startH.toString().padStart(2, "0")}:00`;
    eventEnd.value = `${(startH + 1).toString().padStart(2, "0")}:00`;

    document.querySelector(
      `input[name="eventColor"][value="blue"]`
    ).checked = true;
    editingEventId = null;
  }

  modal.style.display = "block";
  eventTitle.focus();
}

function closeEventModal() {
  document.getElementById("eventModal").style.display = "none";
  editingEventId = null;
}

function saveEvent(e) {
  e.preventDefault();

  const title = document.getElementById("eventTitle").value.trim();
  const startTime = document.getElementById("eventStart").value;
  const endTime = document.getElementById("eventEnd").value;
  const color = document.querySelector(
    'input[name="eventColor"]:checked'
  ).value;

  if (!title || !startTime || !endTime) return alert("Fill all fields");
  if (startTime >= endTime) return alert("End time must be after start time");

  const eventData = {
    id: editingEventId || Date.now().toString(),
    title,
    startTime,
    endTime,
    color,
  };

  if (editingEventId) {
    const index = events.findIndex((ev) => ev.id === editingEventId);
    if (index !== -1) events[index] = eventData;
  } else {
    events.push(eventData);
  }

  // Save to LocalStorage
  localStorage.setItem("calendarEvents", JSON.stringify(events));
  renderEvents();
  closeEventModal();
}

function renderEvents() {
  document.querySelectorAll(".event").forEach((e) => e.remove());

  events.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.className = `event event-${event.color}`;

    const formatTimeStr = (t) => {
      let [h, m] = t.split(":");
      let ampm = h >= 12 ? "PM" : "AM";
      h = h % 12 || 12;
      return `${h}:${m} ${ampm}`;
    };

    eventElement.innerHTML = `<span class="event-time">${formatTimeStr(
      event.startTime
    )} - ${formatTimeStr(event.endTime)}</span><span class="event-title">${
      event.title
    }</span>`;

    const startH = parseInt(event.startTime.split(":")[0]);
    const startM = parseInt(event.startTime.split(":")[1]);
    const endH = parseInt(event.endTime.split(":")[0]);
    const endM = parseInt(event.endTime.split(":")[1]);

    if (startH < 6 || startH >= 23) return;

    const startMinutesFrom6AM = (startH - 6) * 60 + startM;
    const durationMinutes = endH * 60 + endM - (startH * 60 + startM);

    eventElement.style.top = `${startMinutesFrom6AM}px`;
    eventElement.style.height = `${durationMinutes}px`;

    eventElement.addEventListener("click", (e) => {
      e.stopPropagation();
      openEventModal(null, event);
    });

    document.getElementById("calendarBody").appendChild(eventElement);
  });
}

function deleteEvent(id) {
  events = events.filter((e) => e.id !== id);
  localStorage.setItem("calendarEvents", JSON.stringify(events));
  renderEvents();
}

function clearAllEvents() {
  if (confirm("Clear all events?")) {
    events = [];
    localStorage.removeItem("calendarEvents");
    renderEvents();
  }
}

function scrollToCurrentTime() {
  const now = new Date();
  const h = now.getHours();
  if (h >= 6 && h < 23) {
    const scrollPos = (h - 6) * 60;
    document.querySelector(".calendar-container").scrollTo({
      top: scrollPos - 50,
      behavior: "smooth",
    });
  }
}

function updateCurrentTimeIndicator() {
  const now = new Date();
  const h = now.getHours();
  const m = now.getMinutes();
  const indicator = document.getElementById("currentTimeIndicator");

  if (h >= 6 && h < 23) {
    const top = (h - 6) * 60 + m;
    indicator.style.top = `${top}px`;
    indicator.style.display = "block";
  } else {
    indicator.style.display = "none";
  }

  document.querySelectorAll(".time-slot").forEach((slot) => {
    slot.classList.remove("current-hour");
    if (parseInt(slot.dataset.hour) === h) {
      slot.classList.add("current-hour");
    }
  });
}

init();
