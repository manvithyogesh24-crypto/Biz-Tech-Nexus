(function () {
  const STORAGE_KEY = "csbs_dms_data_v6";

  const defaultData = {
    notices: [
      {
        id: "n1",
        title: "Freshers Party 2K25",
        date: "2025-10-13",
        image: "assets/images/notices/freshers-party.jpeg",
        line1: "Department of CS & BS welcomes the incoming batch with a formal Freshers Party celebration.",
        line2: "The event brings students together for introductions, cultural activities, and community bonding."
      },
      {
        id: "n2",
        title: "TECHTATVA 2K25 National-Level Competition",
        date: "2025-11-22",
        image: "assets/images/notices/techtatva-2k25.jpeg",
        line1: "TECHTATVA 2K25 invites UG/PG teams for project, paper, and poster tracks with industry mentors.",
        line2: "This notice covers registration phases, shortlisting windows, and the final on-campus event schedule."
      },
      {
        id: "n3",
        title: "CODE VAULT Hackathon 2025",
        date: "2025-09-19",
        image: "assets/images/notices/code-vault.jpeg",
        line1: "CODE VAULT is a 24-hour innovation hackathon focused on AI solutions and practical problem solving.",
        line2: "Participants compete for prizes and showcase prototypes to academic and industry evaluation panels."
      }
    ],
    events: [
      { id: "e1", title: "Webathon 2026", date: "2026-03-02", venue: "CSBS Innovation Lab", description: "Department-level web solution challenge with evaluation panel." },
      { id: "e2", title: "Data Analytics Workshop", date: "2026-03-12", venue: "MITM Auditorium", description: "Hands-on workshop on data pipelines and dashboarding." },
      { id: "e3", title: "Campus Placement Readiness", date: "2026-03-20", venue: "Training Hall", description: "Resume, aptitude, and interview readiness session." }
    ],
    faculty: [
      {
        id: "f1",
        name: "Dr. Honnaraju .B",
        designation: "Professor & HoD",
        specialization: "Data Analytics, Business Systems",
        email: "honnarajuB@mitmysore.edu.in",
        qualification: "Ph.D., M.Tech",
        experience: "15+ years",
        image: "https://mitmysore.in/wp-content/uploads/2025/10/CBSTS01-scaled.jpg"
      },
      {
        id: "f2",
        name: "Prof. Nanda Kumar R B",
        designation: "Associate Professor",
        specialization: "Software Engineering, Enterprise Systems",
        email: "nandakumar.rb@mitmysore.edu.in",
        qualification: "M.Tech, (Ph.D.)",
        experience: "12+ years",
        image: "https://mitmysore.in/wp-content/uploads/2025/10/CBSTS03-scaled.jpg"
      },
      {
        id: "f3",
        name: "Prof. Sumathi S K",
        designation: "Assistant Professor",
        specialization: "Programming, Web Technologies",
        email: "sumathi.sk@mitmysore.edu.in",
        qualification: "M.Tech",
        experience: "10+ years",
        image: "https://mitmysore.in/wp-content/uploads/2025/10/CBSTS02-scaled.jpg"
      },
      {
        id: "f4",
        name: "Prof. Sahana Seles",
        designation: "Assistant Professor",
        specialization: "AI & Machine Learning",
        email: "sahana.seles@mitmysore.edu.in",
        qualification: "MBA",
        experience: "2+ years",
        image: "https://mitmysore.in/wp-content/uploads/2025/10/CBSTS04-scaled.jpg"
      },
      {
        id: "f5",
        name: "Prof. Poorvi S ",
        designation: "Assistant Professor",
        specialization: "Business Strategy, Networking",
        email: "poorvi.s@mitmysore.edu.in",
        qualification: "BE(CSE)",
        experience: "5+ years",
        image: "https://mitmysore.in/wp-content/uploads/2025/10/CBSTS08-scaled.jpg"
      },
      {
        id: "f6",
        name: "Prof. Apsara",
        designation: "Assistant Professor",
        specialization: "Business Communication, Professional Skills",
        email: "apsara@mitmysore.edu.in",
        qualification: "MBA",
        experience: "4+ years",
        image: "https://mitmysore.in/wp-content/uploads/2025/10/CBSTS09-scaled.jpg"
      },
      {
        id: "f7",
        name: "Prof.Chaithra S",
        designation: "Assistant Professor",
        section: "CSBS",
        specialization: "Business Communication, Professional Skills",
        email: "chaithra.s@mitmysore.edu.in",
        qualification: "M Tech",
        experience: "3+ years",
        image: "https://mitmysore.in/wp-content/uploads/2026/01/1-5.jpeg"
      },
      {
        id: "f8",
        name: "Prof. Rajeshwari M",
        designation: "Assistant Professor",
        specialization: "Mathematics for Computing, Statistics",
        email: "rajeshwari.r@mitmysore.edu.in",
        qualification: "BE(CSE)",
        experience: "8+ years",
        image: "https://mitmysore.in/wp-content/uploads/2025/10/CBSTS07-scaled.jpg"
      }
    ],
    students: [
      { id: "s1", name: "Manvith Y", usn: "4MH23CB025", year: "3", section: "A", placement: "Preparing" },
      { id: "s2", name: "Sumukha Sharma K", usn: "4MH23CB043", year: "3", section: "A", placement: "Preparing" },
      { id: "s3", name: "Khushi KN", usn: "4MH23CB018", year: "3", section: "A", placement: "Preparing" },
      { id: "s4", name: "Joel Kenedy", usn: "4MH23CB017", year: "3", section: "A", placement: "Preparing" },
      { id: "s5", name: "LIKHITHA DH", usn: "4MH23CB022", year: "3", section: "A", placement: "Preparing" },
      { id: "s6", name: "SUMUKH R", usn: "4MH23CB042", year: "3", section: "A", placement: "Preparing" },
      { id: "s7", name: "MOKSHITHA", usn: "4MH24CB021", year: "2", section: "A", placement: "Preparing" },
      { id: "s8", name: "HARSHITH GOWDA N", usn: "4MH24CB404", year: "2", section: "A", placement: "Preparing" },
      { id: "s9", name: "MANOJ B", usn: "4MH24CB020", year: "2", section: "A", placement: "Preparing" },
      { id: "s10", name: "JOSVA CALIDROFF", usn: "4MH24CB019", year: "2", section: "A", placement: "Preparing" },
      { id: "s11", name: "VISMAYA DINESH", usn: "4MH22CB045", year: "4", section: "A", placement: "Placed" },
      { id: "s12", name: "SHUBAM SINGH", usn: "4MH22CB036", year: "4", section: "A", placement: "Placed" },
      { id: "s13", name: "VRUSHAB", usn: "4MH22CB019", year: "4", section: "A", placement: "Placed" },
      { id: "s14", name: "ARJUN GOWDA S", usn: "4MH22CB007", year: "4", section: "A", placement: "Placed" },
      { id: "s15", name: "VAIBHAV N", usn: "4MH22CB038", year: "4", section: "A", placement: "Placed" },
      { id: "s16", name: "GURU N", usn: "4MH22CB035", year: "4", section: "A", placement: "Placed" }
    ],

    achievements: [
      {
        id: "a1",
        category: "student",
        title: "Inter-College Innovation Showcase",
        description: "CSBS students secured top-5 rank in inter-college innovation showcase."
      },
      {
        id: "a2",
        category: "faculty",
        title: "Research and Mentorship Impact",
        description: "Faculty published and mentored multiple applied projects in analytics and web systems."
      },
      {
        id: "a3",
        category: "placement",
        title: "Placement Performance",
        description: "Strong placement and internship participation across senior student batches."
      }
    ]
  };

  function normalizeFacultyQualifications(facultyList) {
    return (facultyList || []).map((member) => {
      const name = (member.name || "").toLowerCase();
      if (name.includes("poorvi") || name.includes("rajeshwari")) {
        return { ...member, qualification: "BE(CSE)" };
      }
      return member;
    });
  }

  function loadData() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return structuredClone(defaultData);
    }
    try {
      const parsed = JSON.parse(raw);
      const achievements = (parsed.achievements || []).map((item, index) => {
        if (typeof item === "string") {
          return {
            id: `a_legacy_${index}`,
            category: "student",
            title: "Achievement",
            description: item
          };
        }
        return {
          id: item.id || `a_${Date.now()}_${index}`,
          category: item.category || "student",
          title: item.title || "Achievement",
          description: item.description || ""
        };
      });
      const faculty = normalizeFacultyQualifications(parsed.faculty || []);

      return {
        notices: parsed.notices || [],
        events: parsed.events || [],
        faculty,
        students: parsed.students || [],
        achievements
      };
    } catch (_) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return structuredClone(defaultData);
    }
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function addItem(collectionName, item) {
    const data = loadData();
    const id = `${collectionName[0]}_${Date.now()}`;
    data[collectionName].push({ id, ...item });
    saveData(data);
    return id;
  }

  function updateItem(collectionName, id, patch) {
    const data = loadData();
    data[collectionName] = data[collectionName].map(item => (item.id === id ? { ...item, ...patch } : item));
    saveData(data);
  }

  function deleteItem(collectionName, id) {
    const data = loadData();
    data[collectionName] = data[collectionName].filter(item => item.id !== id);
    saveData(data);
  }

  window.DMSStore = {
    loadData,
    saveData,
    addItem,
    updateItem,
    deleteItem
  };
})();
