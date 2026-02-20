(function () {
  if (!window.DMSStore) return;

  const STUDENT_AUTH_KEY = "csbs_student_auth";
  const raw = localStorage.getItem(STUDENT_AUTH_KEY);
  if (!raw) {
    window.location.href = "student-login.html";
    return;
  }

  let loggedIn;
  try {
    loggedIn = JSON.parse(raw);
  } catch (_) {
    localStorage.removeItem(STUDENT_AUTH_KEY);
    window.location.href = "student-login.html";
    return;
  }

  const data = DMSStore.loadData();
  const profile = data.students.find((item) => item.id === loggedIn.id) || loggedIn;

  const card = document.getElementById("studentProfileCard");
  if (card) {
    card.innerHTML = `
      <h2>${profile.name}</h2>
      <p><strong>USN:</strong> ${profile.usn}</p>
      <p><strong>Year:</strong> ${profile.year}</p>
      <p><strong>Section:</strong> ${profile.section || "A"}</p>
      <p><strong>Placement Status:</strong> ${profile.placement || "Preparing"}</p>
    `;
  }

  const peers = document.getElementById("studentPeersTable");
  if (peers) {
    const sameYear = data.students.filter((item) => item.year === profile.year);
    peers.innerHTML = sameYear.map((item) => `
      <tr>
        <td>${item.name}</td>
        <td>${item.usn}</td>
        <td>${item.year}</td>
        <td>${item.section || "A"}</td>
        <td>${item.placement || "Preparing"}</td>
      </tr>
    `).join("");
  }

  const logout = document.getElementById("studentLogoutBtn");
  if (logout) {
    logout.addEventListener("click", () => {
      localStorage.removeItem(STUDENT_AUTH_KEY);
      window.location.href = "student-login.html";
    });
  }
})();
