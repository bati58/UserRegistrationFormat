function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

function validateUser(user) {
  const errors = [];

  // Name: must be non-empty string
  const nameRegex = /^[A-Za-z\s\-]+$/;

  if (
    !user.name ||
    typeof user.name !== "string" ||
    user.name.trim().length < 2 ||
    !nameRegex.test(user.name)
  ) {
    errors.push("Name must contain only letters and be at least 2 characters.");
  }

  // Age: must be a number between 1 and 120
  if (!Number.isInteger(user.age) || user.age < 1 || user.age > 120) {
    errors.push("Age must be a valid number between 1 and 120.");
  }

  // Email: basic regex check
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
  ];

  const domain = user.email.split("@")[1];
  if (!allowedDomains.includes(domain)) {
    errors.push(
      "Email domain is not supported. Use a common provider like gmail.com."
    );
  }

  // Phone: digits only, 7–15 characters
  const phoneRegex = /^\d{7,15}$/;
  if (!phoneRegex.test(user.phone)) {
    errors.push("Phone must be 7–15 digits.");
  }

  // Address: city, region, country must be alphabetic or alphanumeric
  const alphaRegex = /^[A-Za-z\s\-]+$/;
  if (!alphaRegex.test(user.address.city)) {
    errors.push("City must contain only letters.");
  }
  if (!alphaRegex.test(user.address.region)) {
    errors.push("Region must contain only letters.");
  }
  if (!alphaRegex.test(user.address.country)) {
    errors.push("Country must contain only letters.");
  }

  // Roles: must be a non-empty array of strings
  const allowedRoles = ["admin", "user", "editor"];

  if (
    !Array.isArray(user.roles) ||
    user.roles.length === 0 ||
    !user.roles.every(
      (role) => typeof role === "string" && allowedRoles.includes(role)
    )
  ) {
    errors.push("Roles must be one or more of: admin, user, editor.");
  }

  return errors;
}

document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;

  const user = {
    name: form.name.value,
    age: parseInt(form.age.value),
    email: form.email.value,
    phone: form.phone.value,
    address: {
      city: form.city.value,
      region: form.region.value,
      country: form.country.value,
    },
    isActive: form.isActive.checked,
    roles: form.roles.value.split(",").map((role) => role.trim()),
  };

  const errors = validateUser(user);
  if (errors.length > 0) {
    alert("❌ Validation errors:\n" + errors.join("\n"));
    return;
  }

  try {
    const res = await fetch("http://localhost:4000/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    const data = await res.json();
    alert(data.message || data.error);
    form.reset();
  } catch (err) {
    alert("❌ Failed to register user");
    console.error(err);
  }
});
