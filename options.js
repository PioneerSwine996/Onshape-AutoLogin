const $ = (id) => document.getElementById(id);

browser.storage.local.get(["email", "password", "enabled"]).then(({ email = "", password = "", enabled = true }) => {
  $("email").value = email;
  $("password").value = password;
  $("enabled").checked = enabled;
});

$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  await browser.storage.local.set({
    email: $("email").value.trim(),
    password: $("password").value,
    enabled: $("enabled").checked,
  });
  $("status").textContent = "Saved";
  setTimeout(() => ($("status").textContent = ""), 1500);
});
