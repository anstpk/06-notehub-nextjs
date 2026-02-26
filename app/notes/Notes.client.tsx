'use client';

import { useState } from 'react'; // Додаємо useState
import { useQuery } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api/noteApi';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import css from './NotesPage.module.css';

export default function NotesClient() {
  // 1. Створюємо стан для пошукового рядка
  const [searchQuery, setSearchQuery] = useState('');

  const { data, isLoading, error } = useQuery({
  queryKey: ['notes', searchQuery],
  queryFn: () => fetchNotes(1, 12, searchQuery),
});

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      {/* 2. ПЕРЕДАЄМО ОБОВ'ЯЗКОВІ ПРОПСИ */}
      <SearchBox value={searchQuery} onChange={setSearchQuery} />
      
      <NoteList notes={data?.notes || []} />
    </div>
  );
}