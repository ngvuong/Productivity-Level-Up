import { useState, useEffect } from 'react';
import { format, parseISO } from 'date-fns';
import Select from 'react-select';
import Overlay from '../components/layout/Overlay';
import Task from '../components/main/Task';
import TaskCard from '../components/ui/TaskCard';
import useTasks from '../hooks/useTasks';
import useModal from '../hooks/useModal';

import { FaPlus } from 'react-icons/fa';
import { dateSelectStyles } from '../lib/selectStyles';
import styles from '../styles/Todo.module.scss';

export default function Todo({ user: { id: userId, tasks: fallbackData } }) {
  const today = format(new Date(), 'yyyy-MM-dd');

  const [selected, setSelected] = useState({ label: 'Today', value: today });
  const [legacySelected, setLegacySelected] = useState();
  const [showLegacy, setShowLegacy] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    name: '',
    project: null,
    tags: [],
    priority: 'P3',
    date: today,
    notes: '',
  });
  const [tasksByDate, setTasksByDate] = useState();
  const [options, setOptions] = useState([]);
  const [legacyOptions, setLegacyOptions] = useState([]);

  const { tasks, setTasks } = useTasks(userId, { fallbackData });
  const { triggerRef, nodeRef, show, setShow } = useModal(false);

  useEffect(() => {
    if (tasks) {
      setTasksByDate(() => {
        const cb1 = (a, t) => ((a[t.date] = [...(a[t.date] || []), t]), a);
        const cb2 = (acc, value) => {
          const label =
            value === today ? 'Today' : format(parseISO(value), 'MMM d, yyyy');
          const option = { label, value };
          const key = value >= today ? 'options' : 'legacy';

          acc[key].push(option);

          return acc;
        };
        const tbd = tasks.reduce(cb1, {});
        const { options, legacy } = Object.keys(tbd)
          .sort()
          .reduce(cb2, { options: [], legacy: [] });

        setOptions(options);
        setLegacyOptions(legacy);

        return tbd;
      });
    }
  }, [tasks, today]);

  const getData = () => {
    const { name, project, tags, priority, date, notes } = taskDetails;

    const taskName = name
      .trim()
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    const data = {
      ...(taskName && { name: taskName }),
      ...(project && { projectId: project }),
      ...(tags.length && { tags }),
      ...(priority && { priority }),
      ...(date && { date }),
      ...(notes && { notes }),
    };

    return data;
  };

  const onSave = async () => {
    const data = getData();

    if (!data.name || !data.priority || !data.date) return;

    const result = await fetch(`/api/user/${userId}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    }).then((res) => res.json());

    if (result.error) return alert(result.error);

    setTasks();
  };

  const listTasks = (items = []) =>
    items.map((task) => (
      <Task key={task.id} {...{ task, tasks, setTasks, userId }} />
    ));

  return (
    <main className={styles.todo}>
      <h1>Manage Tasks</h1>
      <section className={styles.upcoming}>
        <div className={styles.configs}>
          <button className={styles.btnNew} ref={triggerRef}>
            <FaPlus />
          </button>
          {show && (
            <Overlay>
              <TaskCard
                tasks={tasks}
                userId={userId}
                setShowCard={setShow}
                taskDetails={taskDetails}
                setTaskDetails={setTaskDetails}
                onSave={onSave}
                valid={!!getData().name && !!getData().date}
                ref={nodeRef}
              />
            </Overlay>
          )}
          <Select
            value={selected}
            onChange={setSelected}
            options={options}
            isSearchable={false}
            isOptionDisabled={(option) => selected.value === option.value}
            styles={dateSelectStyles}
          />
        </div>
        <div className={styles.tasks}>
          <h3>{selected.label}</h3>
          {tasksByDate && listTasks(tasksByDate[selected.value])}
        </div>
      </section>
      <button
        className={styles.btnLegacy}
        onClick={() => {
          setShowLegacy(!showLegacy);
          setLegacySelected((prev) =>
            prev ? prev : legacyOptions[legacyOptions.length - 1]
          );
        }}
      >
        View History
      </button>
      {showLegacy && (
        <section className={styles.legacy}>
          <h2>Legacy</h2>
          <div className={styles.configs}>
            <Select
              value={legacySelected}
              onChange={setLegacySelected}
              options={legacyOptions}
              isSearchable={false}
              isOptionDisabled={(option) => legacySelected === option}
              placeholder='History'
              styles={dateSelectStyles}
            />
          </div>
          <div className={styles.tasks}>
            <h3>{legacySelected.label}</h3>
            {listTasks(tasksByDate[legacySelected.value])}
          </div>
        </section>
      )}
    </main>
  );
}
