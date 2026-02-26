import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api/noteApi';
import NoteDetailsClient from './NoteDetails.client';

export default async function NoteDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const queryClient = new QueryClient();

  // Попереднє завантаження даних на сервері
  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    // Гідратація: передаємо завантажені дані клієнтському компоненту
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}