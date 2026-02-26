import Link from 'next/link';
import { Note } from '@/types/note';
import css from './NoteList.module.css';

interface NoteListProps {
  notes: Note[];
  onDelete?: (id: string) => void;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className={css.list}>
      {notes.map((note) => (
        <li key={note.id} className={css.item}>
          <h3 className={css.title}>{note.title}</h3>
          <p className={css.tag}>{note.tag}</p>
          <div className={css.actions}>
            <Link href={`/notes/${note.id}`} className={css.link}>
              View details
            </Link>
            <button 
              onClick={() => onDelete && onDelete(note.id)} 
              className={css.button}
            >
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}