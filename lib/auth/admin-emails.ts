export function normalizeEmail(
  email: string | null | undefined
) {
  return (
    email
      ?.trim()
      .replace(/^["']+|["']+$/g, "")
      .toLowerCase() ?? ""
  );
}

export function getAllowedAdminEmails() {
  const legacyAdminEmail =
    process.env.ADMIN_EMAIL ?? "";

  const adminEmails =
    process.env.ADMIN_EMAILS ?? "";

  const emails = [
    legacyAdminEmail,
    ...adminEmails.split(","),
  ]
    .map(normalizeEmail)
    .filter(Boolean);

  return new Set(emails);
}

export function isAllowedAdminEmail(
  email: string | null | undefined
) {
  const normalizedEmail =
    normalizeEmail(email);

  if (!normalizedEmail) {
    return false;
  }

  return getAllowedAdminEmails().has(
    normalizedEmail
  );
}