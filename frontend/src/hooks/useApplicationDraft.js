import { useContext } from 'react';
import { ApplicationDraftContext } from '../context/ApplicationDraftValue';

export function useApplicationDraft() {
    const context = useContext(ApplicationDraftContext);
    if (!context) throw new Error('useApplicationDraft must be used inside ApplicationDraftProvider.');
    return context;
}
