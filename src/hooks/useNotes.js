import { useState, useEffect } from 'react';
import {
    getActiveNotes, 
    getArchivedNotes,
    deleteNote,
    archiveNote,
    unarchiveNote
} from '../utils/network-data';

function useNotes(userId) {
    const [activeNotes, setActiveNotes] = useState([]);
    const [archivedNotes, setArchivedNotes] = useState([]);
    const [loading, setLoading] = useState(true);

    const refreshNotes = async () => {
        setLoading(true);

        const activeResponse = await getActiveNotes();
        const archivedResponse = await getArchivedNotes();

        if (!activeResponse.error && !archivedResponse.error) {
            setActiveNotes(activeResponse.data.filter(note => note.userId === userId));
            setArchivedNotes(archivedResponse.data.filter(note => note.userId === userId));
        }

        setLoading(false);
    };

    const handleDelete = async (id) => {
        await deleteNote(id);
        refreshNotes();
    };

    const handleArchive = async (id) => {
        await archiveNote(id);
        refreshNotes();
    };

    const handleUnarchive = async (id) => {
        await unarchiveNote(id);
        refreshNotes();
    };

    useEffect(() => {
        refreshNotes();
    }, []);

    return {
        activeNotes,
        archivedNotes,
        loading,
        refreshNotes,
        handleDelete,
        handleArchive,
        handleUnarchive
    };
}

export default useNotes;