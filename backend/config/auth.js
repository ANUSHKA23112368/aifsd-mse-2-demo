export const JWT_SECRET = process.env.JWT_SECRET || "patient-auth-demo-secret";

export const getJwtWarning = () => {
  if (process.env.JWT_SECRET) {
    return null;
  }

  return "JWT_SECRET is not set. Using fallback secret for this deployment.";
};
