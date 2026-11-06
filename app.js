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

/* ===== TALENTHUB PREMIUM AUTHENTICATION ===== */

const SUPABASE_URL = "https://mlloveelzlnkoygefhcu.supabase.co";
const SUPABASE_KEY = "sb_publishable_1fxhNvf73Qa8lAa31mNQUA_71NFIHt4"

const authScript = document.createElement("script");
authScript.src = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2";

authScript.onload = async () => {
  const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
  );

  const style = document.createElement("style");

  style.textContent = `
    #talenthub-auth-screen {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: #0c1020;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow-y: auto;
      padding: 22px;
      box-sizing: border-box;
      font-family: Inter, Arial, sans-serif;
    }

    .th-shell {
      width: 100%;
      max-width: 1000px;
      min-height: 570px;
      display: grid;
      grid-template-columns: 1fr .9fr;
      background: #151a30;
      border: 1px solid #303653;
      border-radius: 26px;
      overflow: hidden;
      margin: auto;
      box-shadow: 0 25px 80px #0008;
    }

    .th-left {
      padding: 40px 35px;
      background: radial-gradient(circle at 20% 20%, #493a91, #171a37 65%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      min-width: 0;
    }

    .th-logo {
      font-size: 25px;
      font-weight: 900;
      letter-spacing: -1px;
    }

    .th-logo span {
      color: #a995ff;
    }

    .th-tag {
      color: #bdb6ff;
      font-size: 12px;
      letter-spacing: 2px;
      font-weight: 700;
    }

    .th-heading {
      font-size: clamp(32px, 5vw, 48px);
      line-height: 1.2;
      font-weight: 850;
      margin: 17px 0;
      color: #fff;
      overflow-wrap: anywhere;
    }

    .th-description {
      color: #c2c5da;
      line-height: 1.8;
      font-size: 14px;
      overflow-wrap: anywhere;
    }

    .th-skills {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin-top: 25px;
    }

    .th-skill {
      padding: 13px 10px;
      background: #ffffff12;
      border: 1px solid #ffffff20;
      border-radius: 12px;
      font-size: 12px;
      color: #eeeaff;
    }

    .th-right {
      padding: 40px 32px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      box-sizing: border-box;
      min-width: 0;
    }

    .th-right h2 {
      font-size: 28px;
      margin: 0 0 8px;
      color: white;
    }

    .th-subtitle {
      color: #aeb4ca;
      font-size: 13px;
      margin-bottom: 25px;
    }

    .th-tabs {
      display: flex;
      padding: 5px;
      background: #0d1224;
      border-radius: 11px;
      margin-bottom: 22px;
      gap: 5px;
    }

    .th-tabs button {
      width: 50%;
      border: 0;
      border-radius: 8px;
      padding: 12px;
      color: #b8bdd0;
      background: transparent;
      cursor: pointer;
      font-weight: 700;
    }

    .th-tabs button.active {
      background: #785cff;
      color: white;
    }

    .th-field {
      width: 100%;
      box-sizing: border-box;
      padding: 14px;
      border: 1px solid #343c5a;
      border-radius: 10px;
      background: #0e1428;
      color: white;
      margin-bottom: 13px;
      outline: none;
      font-size: 14px;
    }

    .th-field:focus {
      border-color: #917cff;
    }

    .th-main-btn {
      width: 100%;
      border: 0;
      border-radius: 10px;
      padding: 15px;
      background: linear-gradient(100deg, #7657ff, #a15dff);
      color: white;
      font-weight: 800;
      font-size: 14px;
      cursor: pointer;
      margin-top: 5px;
    }

    .th-main-btn:disabled {
      opacity: .6;
      cursor: wait;
    }

    .th-google {
      width: 100%;
      border: 1px solid #414864;
      background: #202640;
      color: white;
      padding: 14px;
      border-radius: 10px;
      margin-top: 13px;
      font-weight: 700;
      cursor: pointer;
    }

    .th-divider {
      text-align: center;
      color: #858ba5;
      font-size: 12px;
      margin: 18px 0 5px;
    }

    #th-message {
      color: #c3b5ff;
      font-size: 13px;
      margin-top: 15px;
      overflow-wrap: anywhere;
      line-height: 1.5;
    }

    #talenthub-signout {
      display: none;
      position: fixed;
      z-index: 99998;
      right: 15px;
      bottom: 15px;
      background: #7557ef;
      color: white;
      border: 0;
      padding: 11px 17px;
      border-radius: 25px;
      font-weight: bold;
      cursor: pointer;
    }

    /* MOBILE RESPONSIVE DESIGN */

    @media (max-width: 700px) {
      #talenthub-auth-screen {
        align-items: flex-start;
        justify-content: center;
        padding: 12px;
      }

      .th-shell {
        display: flex;
        flex-direction: column;
        width: 100%;
        max-width: 430px;
        min-height: auto;
        margin: auto;
        overflow: visible;
        border-radius: 20px;
      }

      .th-left {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        min-height: auto;
        padding: 25px 22px 22px;
      }

      .th-logo {
        font-size: 23px;
        margin-bottom: 28px;
      }

      .th-tag {
        font-size: 10px;
        letter-spacing: 1.5px;
      }

      .th-heading {
        font-size: 30px;
        line-height: 1.25;
        margin: 14px 0;
        overflow: visible;
      }

      .th-description {
        font-size: 13px;
        line-height: 1.7;
        margin: 0;
      }

      .th-skills {
        margin-top: 19px;
        gap: 8px;
      }

      .th-skill {
        padding: 11px 9px;
        font-size: 11px;
      }

      .th-left small {
        display: block;
        margin-top: 22px;
      }

      .th-right {
        padding: 28px 22px;
      }

      .th-right h2 {
        font-size: 25px;
      }
    }

    @media (max-width: 360px) {
      .th-heading {
        font-size: 27px;
      }

      .th-left {
        padding: 22px 17px;
      }

      .th-right {
        padding: 24px 17px;
      }
    }
  `;

  document.head.appendChild(style);

  const root = document.createElement("div");
  root.id = "talenthub-auth-screen";

  root.innerHTML = `
    <div class="th-shell">

      <section class="th-left">

        <div class="th-logo">
          Talent<span>Hub</span> ✦
        </div>

        <div>
          <div class="th-tag">
            DISCOVER · CREATE · CONNECT
          </div>

          <div class="th-heading">
            Your talent.<br>
            Your stage.<br>
            Your future.
          </div>

          <p class="th-description">
            A place where creative minds meet new opportunities.
            Showcase your skills and let the world discover what you can do.
          </p>

          <div class="th-skills">
            <div class="th-skill">✦ Graphic Designers</div>
            <div class="th-skill">▶ Video Editors</div>
            <div class="th-skill">♫ Musicians</div>
            <div class="th-skill">⌘ Developers</div>
          </div>
        </div>

        <small style="color:#aeb0d0">
          TalentHub · Where talent meets opportunity.
        </small>

      </section>

      <section class="th-right">

        <h2 id="th-title">Create your account</h2>

        <p class="th-subtitle" id="th-subtitle">
          Join a community built around your talent.
        </p>

        <div class="th-tabs">
          <button id="th-signup-tab" class="active" type="button">
            Sign Up
          </button>
          <button id="th-login-tab" type="button">
            Login
          </button>
        </div>

        <form id="th-form">

          <input
            class="th-field"
            id="th-name"
            placeholder="Your full name"
            autocomplete="name"
            required
          >

          <input
            class="th-field"
            id="th-email"
            type="email"
            placeholder="Email address"
            autocomplete="email"
            required
          >

          <input
            class="th-field"
            id="th-password"
            type="password"
            placeholder="Password (minimum 6 characters)"
            autocomplete="new-password"
            minlength="6"
            required
          >

          <button class="th-main-btn" id="th-submit" type="submit">
            Create my account →
          </button>

        </form>

        <div class="th-divider">
          OR CONTINUE WITH
        </div>

        <button class="th-google" id="th-google" type="button">
          Continue with Google
        </button>

        <p id="th-message" aria-live="polite"></p>

      </section>
    </div>
  `;

  document.body.appendChild(root);

  const logout = document.createElement("button");
  logout.id = "talenthub-signout";
  logout.textContent = "Sign out";
  document.body.appendChild(logout);

  let mode = "signup";

  const nameField = document.getElementById("th-name");
  const emailField = document.getElementById("th-email");
  const passwordField = document.getElementById("th-password");
  const message = document.getElementById("th-message");
  const submit = document.getElementById("th-submit");

  function showAuth() {
    root.style.display = "flex";
    logout.style.display = "none";
    document.body.style.overflow = "hidden";
  }

  function showApp() {
    root.style.display = "none";
    logout.style.display = "block";
    document.body.style.overflow = "";
  }

  function setMode(newMode) {
    mode = newMode;
    const signup = mode === "signup";

    document.getElementById("th-signup-tab")
      .classList.toggle("active", signup);

    document.getElementById("th-login-tab")
      .classList.toggle("active", !signup);

    nameField.style.display = signup ? "block" : "none";
    nameField.required = signup;

    passwordField.autocomplete =
      signup ? "new-password" : "current-password";

    document.getElementById("th-title").textContent =
      signup ? "Create your account" : "Welcome back";

    document.getElementById("th-subtitle").textContent =
      signup
        ? "Join a community built around your talent."
        : "Log in and continue your journey.";

    submit.textContent =
      signup ? "Create my account →" : "Login to TalentHub →";

    message.textContent = "";
  }

  document.getElementById("th-signup-tab").onclick =
    () => setMode("signup");

  document.getElementById("th-login-tab").onclick =
    () => setMode("login");

  document.getElementById("th-form").onsubmit =
    async event => {
      event.preventDefault();

      message.textContent = "Please wait...";
      submit.disabled = true;

      try {
        const email = emailField.value.trim();
        const password = passwordField.value;

        if (mode === "signup") {
          const { data, error } = await db.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: nameField.value.trim()
              }
            }
          });

          if (error) throw error;

          if (data.session) {
            message.textContent = "Account created successfully!";
            showApp();
          } else {
            message.textContent =
              "Account created! Please confirm your email, then log in.";
          }

        } else {
          const { error } = await db.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;

          message.textContent = "Login successful!";
          showApp();
        }

      } catch (error) {
        message.textContent =
          error.message || "Something went wrong.";

      } finally {
        submit.disabled = false;
      }
    };

  document.getElementById("th-google").onclick =
    async () => {
      message.textContent = "Connecting to Google...";

      const { error } = await db.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin
        }
      });

      if (error) message.textContent = error.message;
    };

  logout.onclick = async () => {
    const { error } = await db.auth.signOut();

    if (error) {
      showToast(error.message);
    } else {
      setMode("login");
      showAuth();
    }
  };

  db.auth.onAuthStateChange((_event, session) => {
    if (session) showApp();
    else showAuth();
  });

  const { data: sessionData, error: sessionError } =
    await db.auth.getSession();

  if (sessionError) {
    console.error(sessionError);
  }

  if (sessionData.session) showApp();
  else showAuth();
};

authScript.onerror = () => {
  alert("Unable to load the login system. Please refresh the page.");
};

document.head.appendChild(authScript);



