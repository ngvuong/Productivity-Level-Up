import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import Select from 'react-select';
import Level from '../components/ui/Level';
import Plum from '../components/main/Plum';
import usePomodoros from '../hooks/usePomodoros';

import { plumSelectStyles } from '../lib/selectStyles';
import styles from '../styles/Garden.module.scss';

export default function Garden({ user }) {
  const [selected, setSelected] = useState();
  const [options, setOptions] = useState([]);

  const { pomodoros } = usePomodoros(user.id, 'all', {
    fallbackData: user?.pomos,
    revalidateOnMount: true,
  });

  useEffect(() => {
    if (pomodoros) {
      const reducedPomodoros = pomodoros.reduce((acc, curr) => {
        if (!curr.claimed) {
          if (!acc[curr.date]) acc[curr.date] = [];

          acc[curr.date].push(curr);

          return acc;
        }
      }, {});

      const today = format(new Date(), 'yyyy-MM-dd');

      setOptions(
        Object.keys(reducedPomodoros).map((key) => ({
          label: key === today ? 'Today' : format(parseISO(key), 'MMM d, yyyy'),
          value: key,
        }))
      );
    }
  }, [pomodoros]);

  return (
    <main className={styles.garden}>
      <header className={styles.header}>
        <h1>Garden</h1>
        <div className={styles.user}>{user.name || user.email}</div>
        <Level />
      </header>

      <section className={styles.yard}>
        <Select
          value={selected}
          onChange={setSelected}
          options={options}
          isOptionDisabled={(option) => option.value === selected?.value}
          isSearchable={false}
          placeholder='Select Date'
          styles={plumSelectStyles}
        />
        {selected && <Plum userId={user.id} date={selected.value} />}
      </section>
    </main>
  );
}