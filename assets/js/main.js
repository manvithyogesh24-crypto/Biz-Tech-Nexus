(function () {
  if (!window.DMSStore) return;

  const data = window.DMSStore.loadData();
  const path = window.location.pathname.toLowerCase();

  function attachReveal() {
    const nodes = document.querySelectorAll(".reveal");
    if (!nodes.length) return;
    nodes.forEach((node, index) => {
      node.style.setProperty("--stagger", `${Math.min(index * 55, 360)}ms`);
    });
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    }, { threshold: 0.12 });
    nodes.forEach((node) => observer.observe(node));
  }

  function setupCardTilt() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia && window.matchMedia("(pointer: coarse)").matches) return;
    const cards = document.querySelectorAll(".summary-card, .event-item, .notice-item");
    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `translateY(-2px) rotateX(${(-y * 2).toFixed(2)}deg) rotateY(${(x * 2).toFixed(2)}deg)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "";
      });
    });
  }

  function setupActiveNavigation() {
    const sideLinks = document.querySelectorAll(".side-nav a[href^='#']");
    const quickLinks = document.querySelectorAll(".quick-nav a[href^='#']");
    const allLinks = [...sideLinks, ...quickLinks];
    if (!allLinks.length) return;

    const sections = allLinks
      .map(link => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    function setActive(id) {
      allLinks.forEach(link => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible && visible.target && visible.target.id) {
        setActive(visible.target.id);
      }
    }, { threshold: [0.25, 0.45, 0.7] });

    sections.forEach(section => observer.observe(section));
  }

  function setupSplashScreen() {
    const splash = document.getElementById("splashScreen");
    const enterBtn = document.getElementById("enterHomeBtn");
    if (!splash || !enterBtn) return;

    const key = "csbs_splash_seen";
    const seen = sessionStorage.getItem(key) === "true";
    if (seen) {
      splash.classList.add("hidden");
      return;
    }

    splash.classList.remove("hidden");
    document.body.classList.add("splash-open");

    function closeSplash() {
      splash.classList.add("hidden");
      document.body.classList.remove("splash-open");
      sessionStorage.setItem(key, "true");
    }

    enterBtn.addEventListener("click", closeSplash);
  }

  function setupScrollProgress() {
    const bar = document.getElementById("scrollProgress");
    if (!bar) return;

    function update() {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
      bar.style.width = `${Math.min(100, Math.max(0, pct))}%`;
    }

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
  }

  function setupBackToTop() {
    const button = document.getElementById("backToTopBtn");
    if (!button) return;
    button.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function setupCursorGlow() {
    if (!window.matchMedia || window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const glow = document.createElement("div");
    glow.className = "cursor-glow";
    document.body.appendChild(glow);

    let raf = null;
    let x = -200;
    let y = -200;

    function draw() {
      glow.style.left = `${x}px`;
      glow.style.top = `${y}px`;
      raf = null;
    }

    window.addEventListener("mousemove", (event) => {
      x = event.clientX;
      y = event.clientY;
      glow.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(draw);
    }, { passive: true });

    window.addEventListener("mouseleave", () => {
      glow.style.opacity = "0";
    });
  }

  function setupMagneticHover() {
    if (!window.matchMedia || window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const targets = document.querySelectorAll(".btn, .quick-nav a, .side-nav a, .floating-dock a, .floating-dock button");
    targets.forEach((el) => {
      el.addEventListener("mousemove", (event) => {
        const rect = el.getBoundingClientRect();
        const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
        el.style.transform = `translate(${(x * 6).toFixed(2)}px, ${(y * 6).toFixed(2)}px)`;
      });
      el.addEventListener("mouseleave", () => {
        el.style.transform = "";
      });
    });
  }

  function initials(name) {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0].toUpperCase())
      .join("");
  }

  function facultyImage(member, className) {
    if (!member.image) {
      return `<div class="faculty-avatar ${className || ""}">${initials(member.name)}</div>`;
    }
    return `<img src="${member.image}" alt="${member.name}" class="faculty-photo ${className || ""}" loading="lazy" />`;
  }

  function renderSummary() {
    const box = document.getElementById("summaryCards");
    if (!box) return;
    const placed = data.students.filter((s) => s.placement === "Placed").length;
    box.innerHTML = `
      <article class="summary-card"><p>Total Notices</p><p class="value" data-count="${data.notices.length}">0</p></article>
      <article class="summary-card"><p>Upcoming Events</p><p class="value" data-count="${data.events.length}">0</p></article>
      <article class="summary-card"><p>Faculty Members</p><p class="value" data-count="${data.faculty.length}">0</p></article>
      <article class="summary-card"><p>Placed Students</p><p class="value" data-count="${placed}">0</p></article>
    `;
  }

  function setupCounterAnimation() {
    const counters = document.querySelectorAll("[data-count]");
    if (!counters.length) return;
    const reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const animate = (element) => {
      const target = Number(element.dataset.count || 0);
      if (reduceMotion) {
        element.textContent = String(target);
        return;
      }

      const duration = 900;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animate(entry.target);
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.35 });

    counters.forEach((counter) => observer.observe(counter));
  }

  function renderNotices() {
    const box = document.getElementById("noticeBoard");
    if (!box) return;
    const ordered = [...data.notices].sort((a, b) => new Date(b.date) - new Date(a.date));
    box.innerHTML = ordered.map((notice, index) => `
      <article class="notice-item ${index === 0 ? "latest" : ""}">
        <div class="notice-media">
          ${notice.image ? `<img src="${notice.image}" alt="${notice.title}" class="notice-image" loading="lazy" />` : ""}
        </div>
        <div class="notice-content">
          <div class="notice-head">
            <h3>${notice.title}</h3>
            ${index === 0 ? '<span class="badge-latest">LATEST</span>' : ""}
          </div>
          <p class="event-meta">${notice.date}</p>
          <p>${notice.line1 || notice.description || ""}</p>
          <p>${notice.line2 || ""}</p>
        </div>
      </article>
    `).join("");
  }

  function renderEvents() {
    const list = document.getElementById("eventList");
    const select = document.getElementById("regEvent");
    if (!list || !select) return;

    const ordered = [...data.events].sort((a, b) => new Date(a.date) - new Date(b.date));
    list.innerHTML = ordered.map((event) => `
      <article class="event-item">
        <div class="event-thumb" aria-hidden="true"></div>
        <h3>${event.title}</h3>
        <p class="event-meta">${event.date} | ${event.venue}</p>
        <p>${event.description}</p>
        <button type="button" class="btn btn-ghost view-event-btn" data-event-id="${event.id}">View Details</button>
      </article>
    `).join("");

    select.innerHTML = `<option value="">Select an event</option>` +
      ordered.map((event) => `<option value="${event.id}">${event.title} - ${event.date}</option>`).join("");
  }

  function setupEventDetailsModal() {
    const modal = document.getElementById("eventModal");
    const closeBtn = document.getElementById("closeEventModal");
    const title = document.getElementById("eventModalTitle");
    const meta = document.getElementById("eventModalMeta");
    const description = document.getElementById("eventModalDescription");
    const list = document.getElementById("eventList");
    if (!modal || !closeBtn || !title || !meta || !description || !list) return;

    function closeModal() {
      modal.classList.add("hidden");
      document.body.classList.remove("modal-open");
    }

    list.addEventListener("click", (event) => {
      const button = event.target.closest(".view-event-btn");
      if (!button) return;
      const item = data.events.find(ev => ev.id === button.dataset.eventId);
      if (!item) return;
      title.textContent = item.title;
      meta.textContent = `${item.date} | ${item.venue}`;
      description.textContent = item.description;
      modal.classList.remove("hidden");
      document.body.classList.add("modal-open");
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  }

  function setupGalleryModal() {
    const modal = document.getElementById("galleryModal");
    const closeBtn = document.getElementById("closeGalleryModal");
    const modalImage = document.getElementById("galleryModalImage");
    const modalCaption = document.getElementById("galleryModalCaption");
    const gallery = document.querySelector(".gallery-grid");
    if (!modal || !closeBtn || !modalImage || !modalCaption || !gallery) return;

    function closeModal() {
      modal.classList.add("hidden");
      document.body.classList.remove("modal-open");
      modalImage.src = "";
    }

    gallery.addEventListener("click", (event) => {
      const card = event.target.closest(".gallery-card");
      if (!card) return;
      const image = card.querySelector("img");
      const caption = card.querySelector("p");
      if (!image) return;

      modalImage.src = image.src;
      modalImage.alt = image.alt || "Gallery preview";
      modalCaption.textContent = caption ? caption.textContent : "";
      modal.classList.remove("hidden");
      document.body.classList.add("modal-open");
    });

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal();
    });
  }

  function renderFacultyGrid() {
    const grid = document.getElementById("facultyGrid");
    if (!grid) return;
    grid.innerHTML = data.faculty.map((member) => `
      <article class="faculty-card">
        ${facultyImage(member, "faculty-card-photo")}
        <hr class="faculty-divider" />
        <h3 class="faculty-name">${member.name}</h3>
        <p class="faculty-role">${member.designation}</p>
        <p class="faculty-qual">${member.qualification || "N/A"}</p>
        <div class="faculty-icons" aria-hidden="true">
          <span>in</span><span>@</span><span>i</span>
        </div>
        <a class="btn-link" href="faculty.html?id=${member.id}">View Details</a>
      </article>
    `).join("");
  }

  function renderFacultySpotlight() {
    const panel = document.getElementById("facultySpotlight");
    if (!panel) return;
    const member = data.faculty[0];
    if (!member) {
      panel.innerHTML = "<p class='section-note'>No faculty data available.</p>";
      return;
    }

    panel.innerHTML = `
      <p class="eyebrow">Faculty Spotlight</p>
      ${facultyImage(member, "faculty-spotlight-photo")}
      <h3>${member.name}</h3>
      <p class="event-meta">${member.designation}</p>
      <p><strong>Section:</strong> ${member.section || "CSBS"}</p>
      <p><strong>Qualification:</strong> ${member.qualification || "N/A"}</p>
      <p><strong>Experience:</strong> ${member.experience || "N/A"}</p>
      <p><strong>Courses:</strong> ${member.courses || "N/A"}</p>
      <p><strong>Specialization:</strong> ${member.specialization}</p>
      <p><strong>Email:</strong> ${member.email}</p>
      <p class="section-note">${member.profile}</p>
      <a class="btn-link" href="faculty.html?id=${member.id}">Open Profile</a>
    `;
  }

  function renderFacultyDetailPage() {
    const box = document.getElementById("facultyDetail");
    if (!box) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    const member = data.faculty.find((item) => item.id === id);

    if (!member) {
      box.innerHTML = "<h2>Faculty Profile Not Found</h2><p class='meta'>Return to faculty listing.</p>";
      return;
    }

    box.innerHTML = `
      <p class="eyebrow">Faculty Detail</p>
      ${facultyImage(member, "faculty-detail-photo")}
      <h2>${member.name}</h2>
      <p class="meta">${member.designation}</p>
      <p><strong>Section:</strong> ${member.section || "CSBS"}</p>
      <p><strong>Qualification:</strong> ${member.qualification || "N/A"}</p>
      <p><strong>Experience:</strong> ${member.experience || "N/A"}</p>
      <p><strong>Courses Handled:</strong> ${member.courses || "N/A"}</p>
      <p><strong>Specialization:</strong> ${member.specialization}</p>
      <p><strong>Email:</strong> ${member.email}</p>
      <p><strong>Profile:</strong> ${member.profile}</p>
    `;
  }

  function statusClass(status) {
    const normalized = status.toLowerCase();
    if (normalized.includes("placed")) return "placed";
    if (normalized.includes("intern")) return "internship";
    return "preparing";
  }

  function renderStudents() {
    const body = document.getElementById("studentTableBody");
    const yearFilter = document.getElementById("yearFilter");
    const searchInput = document.getElementById("studentSearch");
    const globalSearch = document.getElementById("globalSearch");
    const summary = document.getElementById("placementSummary");
    if (!body || !yearFilter || !searchInput || !summary) return;

    if (globalSearch) {
      globalSearch.addEventListener("input", () => {
        searchInput.value = globalSearch.value;
        draw();
      });
    }

    function draw() {
      const year = yearFilter.value;
      const term = searchInput.value.trim().toLowerCase();
      const filtered = data.students.filter((student) => {
        const yearMatch = year === "all" || student.year === year;
        const textMatch = !term ||
          student.name.toLowerCase().includes(term) ||
          student.usn.toLowerCase().includes(term);
        return yearMatch && textMatch;
      });

      body.innerHTML = filtered.map((student) => `
        <tr>
          <td>
            <div class="student-name">
              <span class="avatar-dot">${initials(student.name)}</span>
              <span>${student.name}</span>
            </div>
          </td>
          <td>${student.usn}</td>
          <td>${student.year}</td>
          <td>${student.section}</td>
          <td><span class="status ${statusClass(student.placement)}">${student.placement}</span></td>
        </tr>
      `).join("");

      const placed = data.students.filter((s) => s.placement === "Placed").length;
      summary.textContent = `Placement Highlights: ${placed} placed students out of ${data.students.length} total records.`;
    }

    yearFilter.addEventListener("change", draw);
    searchInput.addEventListener("input", draw);
    draw();
  }

  function attachEventRegistrationValidation() {
    const form = document.getElementById("eventRegistrationForm");
    const message = document.getElementById("registrationMessage");
    if (!form || !message) return;

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("regName").value.trim();
      const email = document.getElementById("regEmail").value.trim();
      const phone = document.getElementById("regPhone").value.trim();
      const selectedEvent = document.getElementById("regEvent").value;
      const selectedCategory = document.getElementById("regCategory").value;

      if (!name || !email || !phone || !selectedEvent || !selectedCategory) {
        message.textContent = "All fields are mandatory.";
        message.style.color = "#c73333";
        return;
      }

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        message.textContent = "Enter a valid email address.";
        message.style.color = "#c73333";
        return;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        message.textContent = "Phone must be a 10-digit number.";
        message.style.color = "#c73333";
        return;
      }

      message.textContent = `Registration submitted successfully for ${selectedCategory} event (frontend simulation).`;
      message.style.color = "#168257";
      form.reset();
    });
  }

  function renderAchievements() {
    const studentList = document.getElementById("studentAchievementList");
    const facultyList = document.getElementById("facultyAchievementList");
    const placementList = document.getElementById("placementAchievementList");
    if (!studentList || !facultyList || !placementList) return;

    const student = data.achievements.filter(item => item.category === "student");
    const faculty = data.achievements.filter(item => item.category === "faculty");
    const placement = data.achievements.filter(item => item.category === "placement");

    studentList.innerHTML = student.map(item => `<li><strong>${item.title}:</strong> ${item.description}</li>`).join("");
    facultyList.innerHTML = faculty.map(item => `<li><strong>${item.title}:</strong> ${item.description}</li>`).join("");

    const placedCount = data.students.filter(s => s.placement === "Placed").length;
    const placementItems = placement.length
      ? placement.map(item => `<li><strong>${item.title}:</strong> ${item.description}</li>`).join("")
      : "";
    placementList.innerHTML = `${placementItems}<li><strong>Current Status:</strong> ${placedCount} placed out of ${data.students.length} students.</li>`;
  }

  function setupParallaxBackground() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const blobs = document.querySelectorAll(".bg-blob, .glass-orb");
    if (!blobs.length) return;

    window.addEventListener("scroll", () => {
      const offset = window.scrollY * 0.05;
      blobs.forEach((blob, index) => {
        const direction = index % 2 === 0 ? 1 : -1;
        blob.style.transform = `translate3d(0, ${offset * direction}px, 0)`;
      });
    }, { passive: true });
  }

  attachReveal();
  setupActiveNavigation();
  setupCardTilt();

  if (path.endsWith("index.html") || path.endsWith("biztech nexus/") || path.endsWith("biztech nexus")) {
    setupSplashScreen();
    setupScrollProgress();
    setupBackToTop();
    setupCursorGlow();
    setupMagneticHover();
    setupParallaxBackground();
    renderSummary();
    setupCounterAnimation();
    renderNotices();
    renderEvents();
    setupGalleryModal();
    renderFacultyGrid();
    renderFacultySpotlight();
    renderStudents();
    renderAchievements();
    attachEventRegistrationValidation();
    setupEventDetailsModal();
  }

  if (path.endsWith("faculty.html")) {
    renderFacultyDetailPage();
  }
})();
