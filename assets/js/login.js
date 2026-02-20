(function () {
  if (!window.DMSStore) return;

  const ADMIN_AUTH_KEY = "csbs_admin_auth";
  const STUDENT_AUTH_KEY = "csbs_student_auth";

  const adminForm = document.getElementById("adminLoginPageForm");
  const adminMsg = document.getElementById("adminLoginPageMessage");
  if (adminForm && adminMsg) {
    adminForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const user = document.getElementById("adminLoginUser").value.trim();
      const pass = document.getElementById("adminLoginPass").value.trim();

      if (user === "admin" && pass === "csbs2026") {
        localStorage.setItem(ADMIN_AUTH_KEY, "true");
        adminMsg.textContent = "Login successful. Redirecting...";
        adminMsg.style.color = "#168257";
        window.location.href = "admin.html";
        return;
      }

      adminMsg.textContent = "Invalid admin credentials.";
      adminMsg.style.color = "#c73333";
    });
  }

  const studentForm = document.getElementById("studentLoginForm");
  const studentMsg = document.getElementById("studentLoginMessage");
  if (studentForm && studentMsg) {
    studentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const name = document.getElementById("studentLoginName").value.trim().toLowerCase();
      const usn = document.getElementById("studentLoginUsn").value.trim().toLowerCase();
      const data = DMSStore.loadData();
      const student = data.students.find((item) => item.name.toLowerCase() === name && item.usn.toLowerCase() === usn);

      if (!student) {
        studentMsg.textContent = "Student record not found. Check name and USN.";
        studentMsg.style.color = "#c73333";
        return;
      }

      localStorage.setItem(STUDENT_AUTH_KEY, JSON.stringify(student));
      studentMsg.textContent = "Login successful. Redirecting...";
      studentMsg.style.color = "#168257";
      window.location.href = "student.html";
    });
  }
})();
