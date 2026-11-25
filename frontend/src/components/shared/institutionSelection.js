export function normalizeInstitutionSelection(value, limit = 20) {
  return [...new Set(Array.isArray(value) ? value : [])].slice(0, limit);
}

export function toggleInstitutionSelection(value, institutionId, limit = 20) {
  const selected = normalizeInstitutionSelection(value, limit);
  if (selected.includes(institutionId)) return selected.filter((id) => id !== institutionId);
  if (selected.length >= limit) return selected;
  return [...selected, institutionId];
}

export function filterInstitutions(institutions, query) {
  const search = query.trim().toLowerCase();
  return institutions.filter((institution) => !institution.isLegacy && (
    `${institution.name} ${institution.officialName} ${(institution.aliases || []).join(' ')}`
      .toLowerCase()
      .includes(search)
  ));
}
