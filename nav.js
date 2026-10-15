(async function () {
  const nav = document.getElementById("nav");
  if (!nav) return;

  const { data: sessionData } = await db.auth.getSession();
  const session = sessionData.session;

  let isAdmin = false;
  if (session) {
    const { data: profile } = await db
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .maybeSingle();
    isAdmin = Boolean(profile && profile.is_admin);
  }

  const links = [
    ["index.html", "Home"],
    ["contest.html", "Contests"]
  ];

  if (session) {
    links.push(["deposit.html", "Deposit"]);
    links.push(["profile.html", "Profile"]);
  }

  links.push(["rules.html", "Rules and FAQs"]);
  links.push(["tips.html", "Tips"]);
  links.push(["completed.html", "Past tournaments"]);

  if (isAdmin) {
    links.push(["admin.html", "Admin"]);
  }

  if (!session) {
    links.push(["login.html", "Log in"]);
    links.push(["register.html", "Register"]);
  }

  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  nav.textContent = "";

  const bar = document.createElement("div");
  bar.className = "nav-bar";

  const toggle = document.createElement("button");
  toggle.type = "button";
  toggle.className = "nav-toggle";
  toggle.setAttribute("aria-label", "Open menu");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-controls", "nav-links");
  toggle.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" ' +
    'stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">' +
    '<path d="M4 6h16M4 12h16M4 18h16" /></svg>';

  const brand = document.createElement("a");
  brand.className = "nav-brand";
  brand.href = "index.html";
  brand.textContent = "Broskis Gaming Hub";

  const list = document.createElement("ul");
  list.id = "nav-links";
  list.className = "nav-links";

  links.forEach(([file, label]) => {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = file;
    link.textContent = label;
    if (file === currentPage) {
      link.setAttribute("aria-current", "page");
    }
    item.appendChild(link);
    list.appendChild(item);
  });

  if (session) {
    const item = document.createElement("li");
    const logout = document.createElement("a");
    logout.href = "#";
    logout.textContent = "Log out";
    logout.addEventListener("click", async (event) => {
      event.preventDefault();
      await db.auth.signOut();
      window.location.href = "index.html";
    });
    item.appendChild(logout);
    list.appendChild(item);
  }

  const overlay = document.createElement("div");
  overlay.className = "nav-overlay";

  function setOpen(open) {
    list.classList.toggle("open", open);
    overlay.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  toggle.addEventListener("click", () => setOpen(!list.classList.contains("open")));
  overlay.addEventListener("click", () => setOpen(false));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });

  bar.appendChild(toggle);
  bar.appendChild(brand);
  nav.appendChild(bar);
  nav.appendChild(overlay);
  nav.appendChild(list);
})();