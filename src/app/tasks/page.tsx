'use client';

import { useState } from 'react';

import { TaskRow } from '@/components/bonsai/task-row';
import { daysBetween } from '@/lib/bonsai/season';
import { useBonsai } from '@/lib/bonsai/store';
import { Button } from '@/registry/new-york-v4/ui/button';
import { Input } from '@/registry/new-york-v4/ui/input';

import { Plus } from 'lucide-react';
import { toast } from 'sonner';

const TasksPage = () => {
    const { ready, agenda: tasks, trees, addCustomTask } = useBonsai();
    const [adding, setAdding] = useState(false);
    const [title, setTitle] = useState('');
    const [due, setDue] = useState('');
    const [treeId, setTreeId] = useState('');

    if (!ready) return null;

    const now = new Date();
    const overdue = tasks.filter((t) => daysBetween(now, t.due) < 0);
    const today = tasks.filter((t) => daysBetween(now, t.due) === 0);
    const week = tasks.filter((t) => daysBetween(now, t.due) > 0 && daysBetween(now, t.due) <= 7);
    const later = tasks.filter((t) => daysBetween(now, t.due) > 7);

    const saveCustom = () => {
        if (!title.trim() || !due) {
            toast.error('Give the task a title and a date.');

            return;
        }
        addCustomTask({ title: title.trim(), due, treeId: treeId || undefined });
        setTitle('');
        setDue('');
        setTreeId('');
        setAdding(false);
        toast.success('Task added.');
    };

    return (
        <div className='space-y-5'>
            <header className='flex items-center justify-between pt-2'>
                <div>
                    <h1 className='text-2xl font-bold'>Tasks</h1>
                    <p className='text-muted-foreground text-sm'>All care for all your trees, in one list</p>
                </div>
                <Button onClick={() => setAdding((v) => !v)} size='icon' className='size-11 rounded-full'>
                    <Plus className='size-5' />
                </Button>
            </header>

            {adding && (
                <div className='bg-card space-y-3 rounded-3xl p-4'>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Task (e.g. remove wire from Old Man Elm)'
                        className='bg-secondary/60 h-11 rounded-2xl border-none'
                    />
                    <div className='flex gap-2'>
                        <Input
                            type='date'
                            value={due}
                            onChange={(e) => setDue(e.target.value)}
                            className='bg-secondary/60 h-11 flex-1 rounded-2xl border-none'
                        />
                        <select
                            value={treeId}
                            onChange={(e) => setTreeId(e.target.value)}
                            className='bg-secondary/60 h-11 flex-1 rounded-2xl px-3 text-sm'>
                            <option value=''>No specific tree</option>
                            {trees.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <Button onClick={saveCustom} className='h-11 w-full rounded-full'>
                        Add task
                    </Button>
                </div>
            )}

            <TaskGroup title='Overdue' tasks={overdue} tone='alert' />
            <TaskGroup title='Today' tasks={today} />
            <TaskGroup title='This week' tasks={week} />
            <TaskGroup title='Later' tasks={later} />

            {tasks.length === 0 && (
                <div className='bg-card rounded-3xl p-6 text-center'>
                    <p className='font-medium'>Nothing to do 🌿</p>
                    <p className='text-muted-foreground mt-1 text-sm'>
                        Add a tree and watering, feeding and repotting reminders will appear here automatically.
                    </p>
                </div>
            )}
        </div>
    );
};

const TaskGroup = ({
    title,
    tasks,
    tone
}: {
    title: string;
    tasks: ReturnType<typeof useBonsai>['tasks'];
    tone?: 'alert';
}) => {
    if (tasks.length === 0) return null;

    return (
        <section>
            <h2 className={`mb-2 text-sm font-semibold ${tone === 'alert' ? 'text-destructive' : ''}`}>
                {title} · {tasks.length}
            </h2>
            <div className='space-y-2'>
                {tasks.map((task) => (
                    <TaskRow key={task.key} task={task} />
                ))}
            </div>
        </section>
    );
};

export default TasksPage;
