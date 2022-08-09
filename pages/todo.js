import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import Select from 'react-select';
import Spinner from '../components/layout/Spinner';
import Overlay from '../components/layout/Overlay';
import TaskCard from '../components/ui/TaskCard';
import useTasks from '../hooks/useTasks';

import { FaPlus } from 'react-icons/fa';
import styles from '../styles/Todo.module.scss';
import Task from '../components/main/Task';

const dateSelectStyles = {
  control: (styles) => ({
    ...styles,
    minWidth: '10rem',
    fontSize: '1.2rem',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '1px solid #ccc',
  }),
  menu: (styles) => ({
    ...styles,
    fontSize: '1.2rem',
    maxHeight: '20rem',
    backgroundColor: '#1f1f1f',
    overflow: 'auto',
  }),
  singleValue: (styles) => ({
    ...styles,
    color: '#fc2',
  }),
  option: (styles, { isFocused, isSelected }) => ({
    ...styles,
    color: isSelected ? '#909' : 'inherit',
    backgroundColor: isSelected ? '#bff' : isFocused ? '#ffffff33' : 'inherit',
  }),
  indicatorSeparator: (styles) => ({
    ...styles,
    display: 'none',
  }),
};

export default function Todo({ user }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [date, setDate] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [selected, setSelected] = useState({ label: 'Today', value: today });
  const [legacySelected, setLegacySelected] = useState({});
  const [showLegacy, setShowLegacy] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    name: '',
    project: null,
    tags: [],
    priority: 'P3',
    date: today,
    notes: '',
  });
  const { tasks, isLoading, setTasks } = useTasks(user.id, {
    revalidateOnMount: true,
  });

  if (isLoading) {
    return <Spinner />;
  }

  const tasksByDate = tasks.reduce((acc, task) => {
    if (!acc[task.date]) {
      acc[task.date] = [];
    }

    acc[task.date].push(task);

    return acc;
  }, {});

  const options = Object.keys(tasksByDate)
    .filter((date) => date >= today)
    .sort()
    .map((date) => ({
      label: date === today ? 'Today' : format(parseISO(date), 'MMM d, yyyy'),
      value: date,
    }));

  const legacyOptions = Object.keys(tasksByDate)
    .filter((date) => date < today)
    .sort()
    .map((date) => ({
      label: format(parseISO(date), 'MMM d, yyyy'),
      value: date,
    }));

  const onChange = (value) => {
    setSelected(value);
  };

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

    const result = await fetch(`/api/user/${user.id}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data }),
    }).then((res) => res.json());

    if (result.error) return alert(result.error);

    setTasks();
  };

  return (
    <main className={styles.todo}>
      <h1>Manage Tasks</h1>
      <section className={styles.upcoming}>
        <div className={styles.configs}>
          <button onClick={() => setShowCard(!showCard)}>
            <FaPlus />
          </button>
          {showCard && (
            <Overlay>
              <TaskCard
                userId={user.id}
                setShowCard={setShowCard}
                taskDetails={taskDetails}
                setTaskDetails={setTaskDetails}
                onSave={onSave}
                valid={!!getData().name && !!getData().date}
              />
            </Overlay>
          )}
          <Select
            value={selected}
            onChange={onChange}
            options={options}
            isSearchable={false}
            styles={dateSelectStyles}
          />
        </div>
        <div className={styles.tasks}>
          <h3>{selected.label}</h3>
          {tasksByDate[selected.value]?.map((task) => (
            <Task
              key={task.id}
              task={task}
              userId={user.id}
              setTasks={setTasks}
            />
          ))}
        </div>
      </section>
      <button
        className={styles.btnLegacy}
        onClick={() => {
          setShowLegacy(!showLegacy);
          setLegacySelected(legacySelected || legacyOptions[0]);
        }}
      >
        View past tasks
      </button>
      {showLegacy && (
        <section className={styles.legacy}>
          <h2>Legacy</h2>
          <div className={styles.configs}>
            <Select
              value={legacySelected}
              onChange={(value) => setLegacySelected(value)}
              options={legacyOptions}
              isSearchable={false}
              styles={dateSelectStyles}
            />
          </div>
          <div className={styles.tasks}>
            <h3>{legacySelected.label}</h3>
            {tasksByDate[legacySelected.value]?.map((task) => (
              <Task
                key={task.id}
                task={task}
                userId={user.id}
                setTasks={setTasks}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
