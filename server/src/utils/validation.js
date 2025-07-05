// Email validation regex
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation (minimum 8 characters, at least one letter and one number)
export const isValidPassword = (password) => {
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/;
  return passwordRegex.test(password);
};

// Name validation (at least 2 characters, only letters and spaces)
export const isValidName = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name);
};

// Validate signup data
export const validateSignupData = (data) => {
  const errors = [];

  if (!data.name || !isValidName(data.name)) {
    errors.push(
      "Name must be 2-50 characters long and contain only letters and spaces"
    );
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.password || !isValidPassword(data.password)) {
    errors.push(
      "Password must be at least 8 characters long and contain at least one letter and one number"
    );
  }

  if (data.role && !["founder", "investor", "community"].includes(data.role)) {
    errors.push("Role must be one of: founder, investor, community");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Validate login data
export const validateLoginData = (data) => {
  const errors = [];

  if (!data.email || !isValidEmail(data.email)) {
    errors.push("Please provide a valid email address");
  }

  if (!data.password || data.password.length < 1) {
    errors.push("Password is required");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
