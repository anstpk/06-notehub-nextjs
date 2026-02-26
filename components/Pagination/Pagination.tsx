import css from './Pagination.module.css';

export default function Pagination() {
  return (
    <div className={css.container}>
      <button className={css.button}>Prev</button>
      <span className={css.page}>1</span>
      <button className={css.button}>Next</button>
    </div>
  );
}