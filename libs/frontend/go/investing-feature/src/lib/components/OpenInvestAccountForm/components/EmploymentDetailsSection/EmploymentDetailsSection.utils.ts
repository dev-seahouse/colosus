// Function to split option string into readable format. Added spacing ebtween capitalised words
export const formatStrOption = (value: string) =>
  value.replace(/([A-Z][a-z])/g, ' $1').trim();
