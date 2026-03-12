export const DONATION_DESCRIPTION_PREFIX = "[DONATION]";

export const isDonationDescription = (description: string) =>
  description.trimStart().startsWith(DONATION_DESCRIPTION_PREFIX);

export const toDonationDescription = (plainDescription: string) =>
  `${DONATION_DESCRIPTION_PREFIX} ${plainDescription.trim()}\n\nDonation Agreement:\n- Will bring to campus collection area\n- Item is clean and usable`;

export const toDonationTitle = (plainDescription: string) => {
  const trimmed = plainDescription.trim();
  return `Donation: ${trimmed.substring(0, 50)}${trimmed.length > 50 ? "..." : ""}`;
};

