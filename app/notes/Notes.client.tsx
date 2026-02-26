'use client';

import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { useDebounce } from 'use-debounce';
import { fetchNotes } from '@/lib/api';
import NoteList from '@/components/NoteList/NoteList';
import SearchBox from '@/components/SearchBox/SearchBox';
import Pagination from '@/components/Pagination/Pagination';
import Modal from '@/components/Modal/Modal';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from './NotesPage.module.css';

export default function NotesClient() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Виконуємо запит тільки через 300мс після того, як користувач перестав друкувати
  const [debouncedSearch] = useDebounce(search, 300);

  const { data, isLoading, error } = useQuery({
    // Включаємо page та search у ключ, щоб React Query знав, коли оновлювати дані
    queryKey: ['notes', page, debouncedSearch],
    queryFn: () => fetchNotes(page, 12, debouncedSearch),
    placeholderData: keepPreviousData, // Сторінка не "стрибає" при пагінації
  });

  if (error) return <p className={css.error}>Error loading notes.</p>;

  return (
    <div className={css.container}>
      <header className={css.header}>
        <SearchBox onChange={(value) => {
          setSearch(value);
          setPage(1); // Скидаємо на 1 сторінку при новому пошуку
        }} />
        <button className={css.addBtn} onClick={() => setIsModalOpen(true)}>
          Add New Note
        </button>
      </header>

      {isLoading ? (
        <p>Loading notes...</p>
      ) : (
        <>
          <NoteList notes={data?.notes || []} />
          
          <Pagination 
            pageCount={data?.totalPages || 0} 
            onPageChange={setPage} 
            currentPage={page} 
          />
        </>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}