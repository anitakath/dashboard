//Filter all entries based on the search term
export const useSearchTerm = (entries, searchTerm) => {
  if (!searchTerm) return; // If no search term was entered, return no entries.

  const lowerCaseSearchTerm = searchTerm.toLowerCase();

  return entries.filter((entry) => {
    // Check whether the properties exist and are not null
    const titleMatches =
      entry.title && entry.title.toLowerCase().includes(lowerCaseSearchTerm);
    const entryMatches =
      entry.entry && entry.entry.toLowerCase().includes(lowerCaseSearchTerm);
    const nameMatches =
      entry.name && entry.name.toLowerCase().includes(lowerCaseSearchTerm);

    return titleMatches || entryMatches || nameMatches;
  });
};
