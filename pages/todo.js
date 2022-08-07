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

export default function Todo({ user }) {
  const today = format(new Date(), 'yyyy-MM-dd');
  const [date, setDate] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [selected, setSelected] = useState({ label: 'Today', value: today });
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
    if (task.date >= today) {
      if (!acc[task.date]) {
        acc[task.date] = [];
      }

      acc[task.date].push(task);
    }

    return acc;
  }, {});

  const options = Object.keys(tasksByDate)
    .sort()
    .map((date) => ({
      label: date === today ? 'Today' : date,
      value: date,
    }));

  const onChange = () => {};

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
  };

  return (
    <main className={styles.todo}>
      <h1>Manage tasks</h1>
      <section className={styles.tasks}>
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
                valid={!!getData().name}
              />
            </Overlay>
          )}
          <Select value={selected} onChange={onChange} options={options} />
        </div>
        <h2>Today</h2>
        {tasksByDate[selected.value].map((task) => (
          <Task key={task.id} task={task} setTasks={setTasks} />
        ))}
      </section>
    </main>
  );
}
