'use client';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import css from './NoteForm.module.css';

// 1. Оновлена схема валідації
const NoteSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Title is too short!')
    .max(50, 'Title is too long!')
    .required('Title is required'),
  content: Yup.string()
    .max(500, 'Content is too long (max 500 characters)'), // Тепер необов'язкове, без .required()
  tag: Yup.string()
    .required('Please select a tag'),
});

interface NoteFormProps {
  onClose: () => void;
}

export default function NoteForm({ onClose }: NoteFormProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createNote, // Спростили запис
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onClose();
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
            <div className={css.fieldGroup}>
              <label htmlFor="title">Title</label>
              <Field name="title" className={css.input} />
              <ErrorMessage name="title" component="div" className={css.error} />
            </div>

            <div className={css.fieldGroup}>
              <label htmlFor="content">Content</label>
              <Field name="content" as="textarea" className={css.textarea} />
              <ErrorMessage name="content" component="div" className={css.error} />
            </div>

            <div className={css.fieldGroup}>
              <label htmlFor="tag">Tag</label>
              <Field name="tag" as="select" className={css.select}>
                <option value="">Select a tag</option>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </Field>
              <ErrorMessage name="tag" component="div" className={css.error} />
            </div>

            <div className={css.buttons}>
              <button type="button" className={css.cancelBtn} onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className={css.submitBtn} disabled={isSubmitting || mutation.isPending}>
                {mutation.isPending ? 'Saving...' : 'Create Note'}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}