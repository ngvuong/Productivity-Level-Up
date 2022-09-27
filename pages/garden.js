import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import Select from 'react-select';
import Level from '../components/ui/Level';
import Plum from '../components/main/Plum';
import usePomodoros from '../hooks/usePomodoros';

import { plumSelectStyles } from '../lib/selectStyles';
import styles from '../styles/Garden.module.scss';

export default function Garden({ user }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [selected, setSelected] = useState({ label: 'Today', value: today });
  const [options, setOptions] = useState([]);

  const { pomodoros } = usePomodoros(user.id, 'all');

  useEffect(() => {
    if (pomodoros) {
      setOptions(() => {
        const options = pomodoros.reduce((acc, curr) => {
          const date = curr.date;
          const isUnique = !acc.some((p) => p.value === date);

          if (!curr.claimed && isUnique) {
            acc.push({
              label:
                date === today ? 'Today' : format(parseISO(date), 'MMM d yyyy'),
              value: date,
            });
          }

          return acc;
        }, []);

        return options;
      });
    }
  }, [pomodoros, today]);

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
