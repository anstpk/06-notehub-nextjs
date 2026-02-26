'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteNote } from '@/lib/api';
import { Note } from '@/types/note';
import Link from 'next/link';

export default function NoteList({ notes }: { notes: Note[] }) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: string) => deleteNote(id),
    onSuccess: () => {
      // Інвалідація кешу, щоб список оновився сам
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          <Link href={`/notes/${note.id}`}>
            <h3>{note.title}</h3>
            <p>{note.content}</p> {/* Ментор просив додати контент */}
          </Link>
          <button onClick={() => mutation.mutate(note.id)}>
            {mutation.isPending ? 'Deleting...' : 'Delete'}
          </button>
        </li>
      ))}
    </ul>
  );
}