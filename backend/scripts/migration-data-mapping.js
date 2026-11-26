const mariaJsonStringArrays = new Map([
  ['ApplicationEnquiry', ['documents', 'requestedDocuments']], ['Institution', ['aliases']],
  ['InstitutionProgramme', ['fieldsOfStudy']], ['InstitutionApplication', ['requestedDocuments']],
  ['Bursary', ['fieldsOfStudy', 'requiredDocuments']], ['BursaryApplication', ['requestedDocuments']],
  ['ApplicationEnquiryEditHistory', ['changedFields']],
]);
const nullableJsonFields = new Set(['additionalInformation', 'details', 'safeChanges']);

export function mapMariaRecordToPostgres(row, model, Prisma, forWrite = false) {
  const value = { ...row };
  for (const field of mariaJsonStringArrays.get(model) || []) {
    const raw = value[field];
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!Array.isArray(parsed) || parsed.some((item) => typeof item !== 'string')) {
      throw new Error(`MariaDB ${model}.${field} is not a JSON array of strings.`);
    }
    value[field] = parsed;
  }
  if (forWrite) {
    for (const field of nullableJsonFields) {
      if (value[field] === null && Object.hasOwn(value, field)) value[field] = Prisma.DbNull;
    }
    if (model === 'ApplicationDocument' && value.replacedDocumentId) value.replacedDocumentId = null;
  }
  return value;
}
