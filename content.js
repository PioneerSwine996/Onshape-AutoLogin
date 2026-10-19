// Fills and submits the Onshape sign-in form with saved credentials.
// Handles both single-page and two-step (email, then password) forms, reacting
// to DOM changes as they happen instead of polling.

const GIVE_UP_MS = 20000;
// Don't retry within this window, so a wrong password can't loop forever.
const RETRY_COOLDOWN_MS = 60000;
const ATTEMPT_KEY = "onshapeAutoLoginLastAttempt";

const visible = (el) => el && el.offsetParent !== null && !el.disabled;

const find = (selectors) =>
  selectors.map((s) => document.querySelector(s)).find(visible);

// Angular/React ignore plain .value assignment; use the native setter + events.
function setValue(input, value) {
  const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set;
  setter.call(input, value);
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

// Onshape's Continue/Sign in buttons are type="button" and start disabled until
// Angular validates the input. Never fall back to form.requestSubmit(): that
// natively POSTs the half-filled form and returns HTTP 401.
// Returns true once a button was clicked.
function clickPrimary(input) {
  // We start before Angular may have bootstrapped; until ngModel has accepted
  // our value the button does nothing, so wait for Angular to mark it valid.
  if (!input.classList.contains("ng-valid")) return false;
  const scope = input.closest("form") || document;
  const button = [
    ...scope.querySelectorAll('button.btn-primary, button.continue-button, button[type="submit"], input[type="submit"]'),
  ].find(visible);
  if (!button) return false;
  button.click();
  return true;
}

function onSigninPage() {
  return /\/signin/.test(location.pathname) || !!find(['input[type="password"]']);
}

async function run() {
  if (!onSigninPage()) return;

  const last = Number(sessionStorage.getItem(ATTEMPT_KEY) || 0);
  if (Date.now() - last < RETRY_COOLDOWN_MS) return;

  const { email, password, enabled = true } = await browser.storage.local.get([
    "email",
    "password",
    "enabled",
  ]);
  if (!enabled || !email || !password) return;

  sessionStorage.setItem(ATTEMPT_KEY, String(Date.now()));

  // Two-step form: email + Continue, then password + Sign in.
  // Each DOM change fills whatever step is showing and clicks its button once enabled.
  let emailSent = false;
  const observer = new MutationObserver(() => step());
  const stop = () => observer.disconnect();
  setTimeout(stop, GIVE_UP_MS);

  function step() {
    const pw = find(['input[type="password"]']);
    const em = find([
      'input[name="username"]',
      'input[type="email"]',
      'input[name="email"]',
      'input[autocomplete="username"]',
    ]);

    if (pw) {
      if (em && em.value !== email) setValue(em, email);
      const remember = find(['input[type="checkbox"][name*="remember" i]', 'input[type="checkbox"][id*="remember" i]']);
      if (remember && !remember.checked) remember.click();
      if (pw.value !== password) setValue(pw, password);
      if (clickPrimary(pw)) stop();
    } else if (em && !emailSent) {
      if (em.value !== email) setValue(em, email);
      emailSent = clickPrimary(em);
    }
  }

  observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true });
  step();
}

run();
