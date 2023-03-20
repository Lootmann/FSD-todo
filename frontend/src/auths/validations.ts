export const usernameRules = {
  required: "This field is required",
  minLength: {
    value: 5,
    message: "username must be at least 5 characters long.",
  },
  maxLength: {
    value: 100,
    message: "username must be less than 100 characters long.",
  },
};

export const passwordRules = {
  required: "This field is required",
  minLength: {
    value: 8,
    message: "username must be at least 5 characters long.",
  },
  maxLength: {
    value: 100,
    message: "username must be less than 100 characters long.",
  },
};
