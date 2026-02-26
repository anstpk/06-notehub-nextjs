'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import css from './NoteForm.module.css';

// 1. Схема валідації Yup (Вимога ментора)
const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title is too short!')
    .max(50, 'Title is too long!')
    .required('Title is required'),
  content: Yup.string()
    .min(10, 'Content should be at least 10 characters')
    .required('Content is required'),
  tag: Yup.string()
    .required('Please select a tag'),
});

// 2. Інтерфейс пропсів (Вимога ментора — жодних 'any')
interface NoteFormProps {
  onClose: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  // 3. Використання useMutation (Вимога ментора)
  const mutation = useMutation({
    mutationFn: (values: { title: string; content: string; tag: string }) => 
      createNote(values),
    onSuccess: () => {
      // Інвалідація кешу, щоб список нотаток оновився автоматично
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose(); // Закриваємо модалку після успіху
    },
  });

  return (
    <div className={css.formWrapper}>
      <h2 className={css.formTitle}>Create New Note</h2>
      
      <Formik
        initialValues={{ title: '', content: '', tag: '' }}
        validationSchema={NoteSchema}
        onSubmit={(values) => mutation.mutate(values)}
      >
        {({ isSubmitting }) => (
          <Form className={css.form}>
            {/* Поле Title */}
            <div className={css.fieldGroup}>
              <label htmlFor="title">Title</label>
              <Field name="title" className={css.input} placeholder="Enter title..." />
              <ErrorMessage name="title" component="div" className={css.error} />
            </div>

            {/* Поле Content */}
            <div className={css.fieldGroup}>
              <label htmlFor="content">Content</label>
              <Field 
                name="content" 
                as="textarea" 
                className={css.textarea} 
                placeholder="Write your note here..." 
              />
              <ErrorMessage name="content" component="div" className={css.error} />
            </div>

            {/* Поле Tag (Вимога ментора - Select dropdown) */}
            <div className={css.fieldGroup}>
              <label htmlFor="tag">Tag</label>
              <Field name="tag" as="select" className={css.select}>
                <option value="">Select a tag</option>
                <option value="Personal">Personal</option>
                <option value="Work">Work</option>
                <option value="Health">Health</option>
                <option value="General">General</option>
              </Field>
              <ErrorMessage name="tag" component="div" className={css.error} />
            </div>

            {/* Кнопки керування (Вимога ментора - додати Cancel) */}
            <div className={css.buttons}>
              <button 
                type="button" 
                className={css.cancelBtn} 
                onClick={onClose}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={css.submitBtn} 
                disabled={isSubmitting || mutation.isPending}
              >
                {mutation.isPending ? 'Saving...' : 'Create Note'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}