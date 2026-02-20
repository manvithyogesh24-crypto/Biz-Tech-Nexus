(function () {
  if (!window.DMSStore) return;

  const loginSection = document.getElementById("loginSection");
  const dashboardSection = document.getElementById("dashboardSection");
  const loginForm = document.getElementById("loginForm");
  const loginMessage = document.getElementById("loginMessage");
  const logoutBtn = document.getElementById("logoutBtn");
  const AUTH_KEY = "csbs_admin_auth";

  if (!loginSection || !dashboardSection || !loginForm || !loginMessage || !logoutBtn) return;

  function getData() {
    return DMSStore.loadData();
  }

  function isAuthenticated() {
    return localStorage.getItem(AUTH_KEY) === "true";
  }

  function setAuthenticated(state) {
    localStorage.setItem(AUTH_KEY, state ? "true" : "false");
  }

  function showDashboard() {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
    renderAll();
  }

  function showLogin() {
    loginSection.classList.remove("hidden");
    dashboardSection.classList.add("hidden");
  }

  function renderSummary() {
    const data = getData();
    const cards = document.getElementById("adminSummaryCards");
    cards.innerHTML = `
      <article class="summary-card"><p>Notices</p><p class="value">${data.notices.length}</p></article>
      <article class="summary-card"><p>Events</p><p class="value">${data.events.length}</p></article>
      <article class="summary-card"><p>Students</p><p class="value">${data.students.length}</p></article>
      <article class="summary-card"><p>Faculty</p><p class="value">${data.faculty.length}</p></article>
      <article class="summary-card"><p>Achievements</p><p class="value">${data.achievements.length}</p></article>
    `;
  }

  function renderNotices() {
    const data = getData();
    const list = document.getElementById("noticeAdminList");
    list.innerHTML = data.notices.map((item) => `
      <article class="admin-item">
        <strong>${item.title}</strong>
        <p class="event-meta">${item.date}</p>
        <p>${item.description}</p>
        <div class="actions">
          <button data-edit-notice="${item.id}" type="button">Edit</button>
          <button data-delete-notice="${item.id}" type="button" class="danger">Delete</button>
        </div>
      </article>
    `).join("");
  }

  function renderEvents() {
    const data = getData();
    const list = document.getElementById("eventAdminList");
    list.innerHTML = data.events.map((item) => `
      <article class="admin-item">
        <strong>${item.title}</strong>
        <p class="event-meta">${item.date} | ${item.venue}</p>
        <p>${item.description}</p>
        <div class="actions">
          <button data-edit-event="${item.id}" type="button">Edit</button>
          <button data-delete-event="${item.id}" type="button" class="danger">Delete</button>
        </div>
      </article>
    `).join("");
  }

  function renderStudents() {
    const data = getData();
    const list = document.getElementById("studentAdminList");
    list.innerHTML = data.students.map((item) => `
      <article class="admin-item">
        <strong>${item.name}</strong>
        <p class="event-meta">${item.usn} | Year ${item.year} | Section ${item.section || "-"}</p>
        <p>Placement: ${item.placement || "Preparing"}</p>
        <div class="actions">
          <button data-edit-student="${item.id}" type="button">Edit</button>
          <button data-delete-student="${item.id}" type="button" class="danger">Delete</button>
        </div>
      </article>
    `).join("");
  }

  function renderFaculty() {
    const list = document.getElementById("facultyAdminList");
    if (!list) return;
    const data = getData();
    list.innerHTML = data.faculty.map((item) => `
      <article class="admin-item">
        <strong>${item.name}</strong>
        <p class="event-meta">${item.designation}</p>
        <p>${item.specialization}</p>
        <div class="actions">
          <button data-edit-faculty="${item.id}" type="button">Edit</button>
          <button data-delete-faculty="${item.id}" type="button" class="danger">Delete</button>
        </div>
      </article>
    `).join("");
  }

  function renderAchievements() {
    const list = document.getElementById("achievementAdminList");
    if (!list) return;
    const data = getData();
    list.innerHTML = data.achievements.map((item) => `
      <article class="admin-item">
        <strong>${item.title}</strong>
        <p class="event-meta">Category: ${item.category}</p>
        <p>${item.description}</p>
        <div class="actions">
          <button data-edit-achievement="${item.id}" type="button">Edit</button>
          <button data-delete-achievement="${item.id}" type="button" class="danger">Delete</button>
        </div>
      </article>
    `).join("");
  }

  function renderAll() {
    renderSummary();
    renderNotices();
    renderEvents();
    renderStudents();
    renderFaculty();
    renderAchievements();
  }

  function bindNotice() {
    const form = document.getElementById("noticeForm");
    const list = document.getElementById("noticeAdminList");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = document.getElementById("noticeId").value;
      const payload = {
        title: document.getElementById("noticeTitle").value.trim(),
        date: document.getElementById("noticeDate").value,
        description: document.getElementById("noticeDescription").value.trim()
      };
      if (!payload.title || !payload.date || !payload.description) return;
      if (id) DMSStore.updateItem("notices", id, payload);
      else DMSStore.addItem("notices", payload);
      form.reset();
      document.getElementById("noticeId").value = "";
      renderAll();
    });

    list.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-notice");
      const deleteId = event.target.getAttribute("data-delete-notice");
      const data = getData();
      if (editId) {
        const item = data.notices.find((n) => n.id === editId);
        if (!item) return;
        document.getElementById("noticeId").value = item.id;
        document.getElementById("noticeTitle").value = item.title;
        document.getElementById("noticeDate").value = item.date;
        document.getElementById("noticeDescription").value = item.description;
      }
      if (deleteId) {
        DMSStore.deleteItem("notices", deleteId);
        renderAll();
      }
    });
  }

  function bindEvent() {
    const form = document.getElementById("eventForm");
    const list = document.getElementById("eventAdminList");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = document.getElementById("eventId").value;
      const payload = {
        title: document.getElementById("eventTitle").value.trim(),
        date: document.getElementById("eventDate").value,
        venue: document.getElementById("eventVenue").value.trim(),
        description: document.getElementById("eventDescription").value.trim()
      };
      if (!payload.title || !payload.date || !payload.venue || !payload.description) return;
      if (id) DMSStore.updateItem("events", id, payload);
      else DMSStore.addItem("events", payload);
      form.reset();
      document.getElementById("eventId").value = "";
      renderAll();
    });

    list.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-event");
      const deleteId = event.target.getAttribute("data-delete-event");
      const data = getData();
      if (editId) {
        const item = data.events.find((e) => e.id === editId);
        if (!item) return;
        document.getElementById("eventId").value = item.id;
        document.getElementById("eventTitle").value = item.title;
        document.getElementById("eventDate").value = item.date;
        document.getElementById("eventVenue").value = item.venue;
        document.getElementById("eventDescription").value = item.description;
      }
      if (deleteId) {
        DMSStore.deleteItem("events", deleteId);
        renderAll();
      }
    });
  }

  function bindStudent() {
    const form = document.getElementById("studentForm");
    const list = document.getElementById("studentAdminList");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = document.getElementById("studentId").value;
      const payload = {
        name: document.getElementById("studentName").value.trim(),
        usn: document.getElementById("studentUsn").value.trim(),
        year: document.getElementById("studentYear").value,
        section: document.getElementById("studentSection").value.trim(),
        placement: document.getElementById("studentPlacement").value
      };
      if (!payload.name || !payload.usn || !payload.year || !payload.section) return;
      if (id) DMSStore.updateItem("students", id, payload);
      else DMSStore.addItem("students", payload);
      form.reset();
      document.getElementById("studentId").value = "";
      renderAll();
    });

    list.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-student");
      const deleteId = event.target.getAttribute("data-delete-student");
      const data = getData();
      if (editId) {
        const item = data.students.find((s) => s.id === editId);
        if (!item) return;
        document.getElementById("studentId").value = item.id;
        document.getElementById("studentName").value = item.name || "";
        document.getElementById("studentUsn").value = item.usn || "";
        document.getElementById("studentYear").value = item.year || "1";
        document.getElementById("studentSection").value = item.section || "A";
        document.getElementById("studentPlacement").value = item.placement || "Preparing";
      }
      if (deleteId) {
        DMSStore.deleteItem("students", deleteId);
        renderAll();
      }
    });
  }

  function bindFaculty() {
    const form = document.getElementById("facultyForm");
    const list = document.getElementById("facultyAdminList");
    if (!form || !list) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = document.getElementById("facultyId").value;
      const payload = {
        name: document.getElementById("facultyName").value.trim(),
        designation: document.getElementById("facultyDesignation").value.trim(),
        specialization: document.getElementById("facultySpecialization").value.trim(),
        email: document.getElementById("facultyEmail").value.trim(),
        qualification: document.getElementById("facultyQualification").value.trim(),
        experience: document.getElementById("facultyExperience").value.trim(),
        courses: document.getElementById("facultyCourses").value.trim(),
        profile: document.getElementById("facultyProfile").value.trim(),
        image: document.getElementById("facultyImage").value.trim()
      };
      if (!payload.name || !payload.designation || !payload.specialization || !payload.email) return;
      if (id) DMSStore.updateItem("faculty", id, payload);
      else DMSStore.addItem("faculty", payload);
      form.reset();
      document.getElementById("facultyId").value = "";
      renderAll();
    });

    list.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-faculty");
      const deleteId = event.target.getAttribute("data-delete-faculty");
      const data = getData();
      if (editId) {
        const item = data.faculty.find((f) => f.id === editId);
        if (!item) return;
        document.getElementById("facultyId").value = item.id;
        document.getElementById("facultyName").value = item.name || "";
        document.getElementById("facultyDesignation").value = item.designation || "";
        document.getElementById("facultySpecialization").value = item.specialization || "";
        document.getElementById("facultyEmail").value = item.email || "";
        document.getElementById("facultyQualification").value = item.qualification || "";
        document.getElementById("facultyExperience").value = item.experience || "";
        document.getElementById("facultyCourses").value = item.courses || "";
        document.getElementById("facultyProfile").value = item.profile || "";
        document.getElementById("facultyImage").value = item.image || "";
      }
      if (deleteId) {
        DMSStore.deleteItem("faculty", deleteId);
        renderAll();
      }
    });
  }

  function bindAchievement() {
    const form = document.getElementById("achievementForm");
    const list = document.getElementById("achievementAdminList");
    if (!form || !list) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const id = document.getElementById("achievementId").value;
      const payload = {
        category: document.getElementById("achievementCategory").value,
        title: document.getElementById("achievementTitle").value.trim(),
        description: document.getElementById("achievementDescription").value.trim()
      };
      if (!payload.category || !payload.title || !payload.description) return;
      if (id) DMSStore.updateItem("achievements", id, payload);
      else DMSStore.addItem("achievements", payload);
      form.reset();
      document.getElementById("achievementId").value = "";
      renderAll();
    });

    list.addEventListener("click", (event) => {
      const editId = event.target.getAttribute("data-edit-achievement");
      const deleteId = event.target.getAttribute("data-delete-achievement");
      const data = getData();
      if (editId) {
        const item = data.achievements.find((a) => a.id === editId);
        if (!item) return;
        document.getElementById("achievementId").value = item.id;
        document.getElementById("achievementCategory").value = item.category || "student";
        document.getElementById("achievementTitle").value = item.title || "";
        document.getElementById("achievementDescription").value = item.description || "";
      }
      if (deleteId) {
        DMSStore.deleteItem("achievements", deleteId);
        renderAll();
      }
    });
  }

  function bindAllCrud() {
    bindNotice();
    bindEvent();
    bindStudent();
    bindFaculty();
    bindAchievement();
  }

  bindAllCrud();

  if (isAuthenticated()) showDashboard();
  else showLogin();
})();
