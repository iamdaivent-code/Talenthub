/* TalentHub frontend JavaScript.
   Demo data is local. Replace these functions with backend API calls later. */

"use strict";

const creators = [
  {id:1,name:"Aarav Sharma",skill:"Video Editor",bio:"Professional reels, YouTube videos and cinematic edits.",price:"₹500",image:"https://i.pravatar.cc/100?img=12",work:"https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=700"},
  {id:2,name:"Meera Kapoor",skill:"Graphic Designer",bio:"Creative branding, social media designs and logos.",price:"₹800",image:"https://i.pravatar.cc/100?img=47",work:"https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=700"},
  {id:3,name:"Kabir Khan",skill:"Photographer",bio:"Portrait, product and lifestyle photography.",price:"₹1,000",image:"https://i.pravatar.cc/100?img=33",work:"https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=700"},
  {id:4,name:"Sara Ali",skill:"Singer",bio:"Vocal performances, covers and original music.",price:"₹700",image:"https://i.pravatar.cc/100?img=44",work:"https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=700"},
  {id:5,name:"Rehan Ahmed",skill:"Web Developer",bio:"Modern responsive websites and web applications.",price:"₹1,500",image:"https://i.pravatar.cc/100?img=13",work:"https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=700"},
  {id:6,name:"Ananya Verma",skill:"Animator",bio:"2D animation, motion graphics and visual storytelling.",price:"₹1,200",image:"https://i.pravatar.cc/100?img=49",work:"https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700"}
];

let activeFilter = "All";

function navigate(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.querySelectorAll(".nav-link[data-page]").forEach(link => link.classList.remove("active"));

  const page = document.getElementById(pageId);
  if (page) page.classList.add("active");

  const nav = document.querySelector(`.nav-link[data-page="${pageId}"]`);
  if (nav) nav.classList.add("active");

  window.scrollTo({top:0,behavior:"smooth"});
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = "block";
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    toast.style.display = "none";
  }, 2600);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  })[char]);
}

function createCreatorCard(person) {
  return `
    <article class="talent-card">
      <img class="talent-image" src="${person.work}" alt="Portfolio sample for ${escapeHTML(person.name)}" loading="lazy">
      <div class="talent-info">
        <div class="creator-row">
          <img src="${person.image}" alt="${escapeHTML(person.name)}" loading="lazy">
          <div>
            <div class="creator-name">${escapeHTML(person.name)} <i class="fa-solid fa-circle-check verified" aria-label="Featured"></i></div>
            <div class="creator-role">${escapeHTML(person.skill)}</div>
          </div>
        </div>
        <p class="talent-desc">${escapeHTML(person.bio)}</p>
        <div class="card-footer">
          <div class="price">${escapeHTML(person.price)} <small>/ project</small></div>
          <button class="view-btn" data-creator-id="${person.id}">View Profile</button>
        </div>
      </div>
    </article>`;
}

function renderCreators(list, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = list.length
    ? list.map(createCreatorCard).join("")
    : "<p>No creators found. Try another search.</p>";

  if (containerId === "exploreTalent") {
    const count = document.getElementById("resultCount");
    if (count) count.textContent = `Showing ${list.length} creator${list.length === 1 ? "" : "s"}`;
  }
}

function applyExploreFilters() {
  const query = (document.getElementById("globalSearch")?.value || "").trim().toLowerCase();

  const filtered = creators.filter(person => {
    const matchesCategory = activeFilter === "All" || person.skill === activeFilter;
    const searchable = `${person.name} ${person.skill} ${person.bio}`.toLowerCase();
    return matchesCategory && searchable.includes(query);
  });

  renderCreators(filtered, "exploreTalent");
}

function filterTalent(skill) {
  activeFilter = skill;
  document.querySelectorAll(".filter-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === skill);
  });
  navigate("explore");
  applyExploreFilters();
}

function viewCreator(id) {
  const person = creators.find(item => item.id === Number(id));
  if (!person) return;
  showToast(`${person.name} — ${person.skill}. Dynamic profiles will be loaded from the backend later.`);
}

function openProfileModal() {
  loadSavedProfile();
  const modal = document.getElementById("profileModal");
  modal?.classList.add("show");
  modal?.setAttribute("aria-hidden", "false");
}

function closeProfileModal() {
  const modal = document.getElementById("profileModal");
  modal?.classList.remove("show");
  modal?.setAttribute("aria-hidden", "true");
}

function loadSavedProfile() {
  try {
    const profile = JSON.parse(localStorage.getItem("talenthub_profile") || "null");
    if (!profile) return;
    document.getElementById("creatorName").value = profile.name || "";
    document.getElementById("creatorSkill").value = profile.skill || "";
    document.getElementById("creatorBio").value = profile.bio || "";
    document.getElementById("profileName").textContent = profile.name || "Your Name";
    document.getElementById("profileSkill").textContent = profile.skill || "Creative Professional";
    document.getElementById("profileBio").textContent = profile.bio || "Add a short introduction about your work and skills.";
  } catch (error) {
    console.error("Could not load saved profile:", error);
  }
}

function saveProfile(event) {
  event.preventDefault();

  const profile = {
    name: document.getElementById("creatorName").value.trim(),
    skill: document.getElementById("creatorSkill").value.trim(),
    bio: document.getElementById("creatorBio").value.trim()
  };

  if (!profile.name || !profile.skill || !profile.bio) {
    showToast("Please complete all profile fields.");
    return;
  }

  // Temporary browser-only demo storage. Use a backend for real accounts.
  localStorage.setItem("talenthub_profile", JSON.stringify(profile));
  loadSavedProfile();
  closeProfileModal();
  showToast("Profile saved on this device.");
}

async function startCheckout(plan) {
  const plans = {
    pro: {name:"Creator Pro", amount:49},
    plus: {name:"Creator Plus", amount:99}
  };
  const selectedPlan = plans[plan];
  if (!selectedPlan) return showToast("Invalid plan selected.");

  // Future integration: call your server to create a payment order.
  // Never put Razorpay/Cashfree secret keys in frontend JavaScript.
  showToast(`${selectedPlan.name} selected. Payment gateway is not connected yet.`);
}

function initApp() {
  renderCreators(creators.slice(0, 3), "homeTalent");
  renderCreators(creators, "exploreTalent");
  loadSavedProfile();

  document.querySelectorAll(".nav-link[data-page]").forEach(link => {
    link.addEventListener("click", () => navigate(link.dataset.page));
  });

  document.querySelectorAll("[data-go]").forEach(button => {
    button.addEventListener("click", () => navigate(button.dataset.go));
  });

  document.querySelectorAll("[data-category]").forEach(button => {
    button.addEventListener("click", () => filterTalent(button.dataset.category));
  });

  document.querySelectorAll("[data-filter]").forEach(button => {
    button.addEventListener("click", () => filterTalent(button.dataset.filter));
  });

  document.getElementById("globalSearch")?.addEventListener("input", () => {
    activeFilter = "All";
    document.querySelectorAll(".filter-btn").forEach(button => {
      button.classList.toggle("active", button.dataset.filter === "All");
    });
    navigate("explore");
    applyExploreFilters();
  });

  document.addEventListener("click", event => {
    const profileButton = event.target.closest("[data-creator-id]");
    if (profileButton) viewCreator(profileButton.dataset.creatorId);

    const planButton = event.target.closest("[data-plan]");
    if (planButton) startCheckout(planButton.dataset.plan);
  });

  document.getElementById("editProfileBtn")?.addEventListener("click", openProfileModal);
  document.getElementById("closeModal")?.addEventListener("click", closeProfileModal);
  document.getElementById("profileForm")?.addEventListener("submit", saveProfile);
  document.getElementById("profileModal")?.addEventListener("click", event => {
    if (event.target.id === "profileModal") closeProfileModal();
  });

  document.getElementById("addProjectBtn")?.addEventListener("click", () => {
    showToast("Portfolio upload will be connected to cloud storage later.");
  });
  document.getElementById("settingsBtn")?.addEventListener("click", () => showToast("Settings coming soon."));
  document.getElementById("notificationsBtn")?.addEventListener("click", () => showToast("No new notifications."));
}

document.addEventListener("DOMContentLoaded", initApp);

/* BACKEND INTEGRATION PLACEHOLDERS
async function fetchCreatorsFromBackend() {
  const response = await fetch("https://YOUR_API_URL/api/creators");
  if (!response.ok) throw new Error("Unable to fetch creators");
  const data = await response.json();
  renderCreators(data, "exploreTalent");
}

async function registerUser(userData) {
  const response = await fetch("https://YOUR_API_URL/api/auth/register", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(userData)
  });
  if (!response.ok) throw new Error("Registration failed");
  return response.json();
}
*/
// ===== TALENTHUB AUTHENTICATION =====

const SUPABASE_URL = "https://mlloveelzlnkoygefhcu.supabase.co"
const SUPABASE_KEY = "sb_publishable_1fxhNvf73Qa8lAa31mNQUA_71NFIHt4"

const authScript = document.createElement("script");
authScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

authScript.onload = () => {
  const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  const box = document.createElement("div");
  box.id = "talenthub-auth";
  box.innerHTML = `
    <h2>Welcome to TalentHub</h2>
    <input id="auth-email" type="email" placeholder="Your email">
    <input id="auth-password" type="password" placeholder="Password">
    <button id="signup-btn">Create Account</button>
    <button id="login-btn">Login</button>
    <button id="google-btn">Continue with Google</button>
    <button id="logout-btn" style="display:none">Logout</button>
    <p id="auth-message"></p>
  `;

  document.body.prepend(box);

  const message = document.getElementById("auth-message");

  document.getElementById("signup-btn").onclick = async () => {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;

    const { error } = await db.auth.signUp({ email, password });
    message.textContent = error ? error.message :
      "Account created! Check your email for confirmation.";
  };

  document.getElementById("login-btn").onclick = async () => {
    const email = document.getElementById("auth-email").value;
    const password = document.getElementById("auth-password").value;

    const { error } = await db.auth.signInWithPassword({ email, password });
    message.textContent = error ? error.message : "Login successful!";
  };

  document.getElementById("google-btn").onclick = async () => {
    const { error } = await db.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
    if (error) message.textContent = error.message;
  };

  document.getElementById("logout-btn").onclick = async () => {
    await db.auth.signOut();
    message.textContent = "Logged out successfully.";
  };
};

document.head.appendChild(authScript);
