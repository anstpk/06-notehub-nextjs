'use client';

import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/noteApi';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './NotesPage.module.css';

export default function NotesClient() {
  const { data, isLoading, error } = useQuery({
  queryKey: ['notes'],
  queryFn: () => fetchNotes(),
});

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <SearchBox />
      {/* Тут буде твоя логіка створення нової нотатки */}
      <NoteList notes={data?.notes || []} />
    </div>
  );
}