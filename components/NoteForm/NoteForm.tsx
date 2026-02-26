'use client';
import { useState } from 'react';
import css from './NoteForm.module.css';

export default function NoteForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, tag: 'General' });
    setTitle('');
    setContent('');
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <input
        className={css.input}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <textarea
        className={css.textarea}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        required
      />
      <button type="submit" className={css.button}>Add Note</button>
    </form>
  );
}