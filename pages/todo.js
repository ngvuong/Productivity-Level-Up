import { useState } from 'react';
import { format } from 'date-fns';
import Overlay from '../components/layout/Overlay';
import TaskCard from '../components/ui/TaskCard';

import { FaPlus } from 'react-icons/fa';
import styles from '../styles/Todo.module.scss';

export default function Todo({ user }) {
  const [date, setDate] = useState('');
  const [showCard, setShowCard] = useState(false);
  const [taskDetails, setTaskDetails] = useState({
    name: '',
    project: null,
    tags: [],
    priority: 'P3',
    date: format(new Date(), 'yyyy-MM-dd'),
    notes: '',
  });

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
    console.log(data);
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
      <section>
        <div>
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
        </div>
        <h2>Today</h2>
      </section>
    </main>
  );
}
