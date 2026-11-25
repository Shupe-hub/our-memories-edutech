import { useMemo, useState } from 'react';
import { ApplicationDraftContext } from './ApplicationDraftValue';

export function ApplicationDraftProvider({ children }) {
    const [draft, setDraft] = useState(null);
    const value = useMemo(() => ({ draft, saveDraft: setDraft, clearDraft: () => setDraft(null) }), [draft]);
    return <ApplicationDraftContext.Provider value={value}>{children}</ApplicationDraftContext.Provider>;
}
