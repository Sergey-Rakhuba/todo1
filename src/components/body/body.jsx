import { useState, useEffect } from 'react'
import "./body.css";
import Modal from '../Modal/Modal';
import TaskModal from '../TaskModal/TaskModal';

const STORAGE_KEYS = {
    OPEN_TASKS: 'todoApp_openTasks',
    DONE_TASKS: 'todoApp_doneTasks'
};

const HomePage = () => {
    const [openTasks, setOpenTasks] = useState(() => {
        const savedOpenTasks = localStorage.getItem(STORAGE_KEYS.OPEN_TASKS);
        return savedOpenTasks ? JSON.parse(savedOpenTasks) : [];
    });
    
    const [doneTasks, setDoneTasks] = useState(() => {
        const savedDoneTasks = localStorage.getItem(STORAGE_KEYS.DONE_TASKS);
        return savedDoneTasks ? JSON.parse(savedDoneTasks) : [];
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    // Для анимации при смене статуса таска
    const [animatingId, setAnimatingId] = useState(null);
    const [recentToggledId, setRecentToggledId] = useState(null);

    // Сохраняем задачи при изменениях
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.OPEN_TASKS, JSON.stringify(openTasks));
        localStorage.setItem(STORAGE_KEYS.DONE_TASKS, JSON.stringify(doneTasks));
    }, [openTasks, doneTasks]);
    
    const handleAddTask = (taskData) => {
        const newTask = {
            ...taskData,
            id: Date.now(),
            isCompleted: false,
            content: taskData.content || '' // Полное описание
        };
        setOpenTasks(prev => [...prev, newTask]);
        setIsModalOpen(false);
    };

    const handleTaskClick = (task, e) => {
        // Игнорируем клики по чекбоксу и кнопке удаления
        if (
            e.target.type === 'checkbox' || 
            e.target.className.includes('delete-button') ||
            e.target.parentElement.className.includes('delete-button')
        ) {
            return;
        }
        setSelectedTask(task);
        setIsTaskModalOpen(true);
    };

    const handleSaveTask = (updatedTask) => {
        if (updatedTask.isCompleted) {
            setDoneTasks(prev => 
                prev.map(task => 
                    task.id === updatedTask.id ? updatedTask : task
                )
            );
        } else {
            setOpenTasks(prev => 
                prev.map(task => 
                    task.id === updatedTask.id ? updatedTask : task
                )
            );
        }
        setIsTaskModalOpen(false);
    };

    const handleDeleteTask = (taskId, isCompleted) => {
        if (!isCompleted) {
            setOpenTasks(prev => prev.filter(task => task.id !== taskId));
        } else {
            setDoneTasks(prev => prev.filter(task => task.id !== taskId));
        }
    };

    const ANIM_MS = 240; // длительность анимации в ms (должна соответствовать CSS)

    const handleToggleTask = (taskId, currentStatus) => {
        // Если уже в процессе анимации — игнорируем последующие клики
        if (animatingId) return;

        // Помечаем таск как анимируемый (анимируем исчезновение)
        setAnimatingId(taskId);

        // Через время анимации перемещаем таску между колонками
        setTimeout(() => {
            if (!currentStatus) {
                const taskToMove = openTasks.find(task => task.id === taskId);
                if (taskToMove) {
                    setOpenTasks(prev => prev.filter(task => task.id !== taskId));
                    setDoneTasks(prev => [...prev, { ...taskToMove, isCompleted: true }]);
                }
            } else {
                const taskToMove = doneTasks.find(task => task.id === taskId);
                if (taskToMove) {
                    setDoneTasks(prev => prev.filter(task => task.id !== taskId));
                    setOpenTasks(prev => [...prev, { ...taskToMove, isCompleted: false }]);
                }
            }

            // Сбрасываем состояние анимации исчезновения
            setAnimatingId(null);

            // Помечаем таск как недавно переключённый — чтобы применить анимацию появления
            setRecentToggledId(taskId);
            // Убираем метку спустя чуть больше времени появления
            setTimeout(() => setRecentToggledId(null), ANIM_MS + 80);
        }, ANIM_MS);
    };

    return (
        <>
            <div className="body-container">
                <h1>Todo List</h1>
                <div className="flex_row info-block">
                    <div className="item">
                        <div className="logo">Logo</div>
                    </div>
                    <div className="p">Total tasks: {openTasks.length + doneTasks.length}</div>
                    <div className="p">Tasks open: {openTasks.length}</div>
                    <div className="p">Tasks done: {doneTasks.length}</div>

                    <div className="item">
                        <div className="button-block">
                            <button 
                                id='todoAdd'
                                onClick={() => setIsModalOpen(true)} 
                                className="btn btn-primary"
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="tasks-container">
                <div className="task-column">
                    <h2 className="column-header">Open Tasks</h2>
                    <div className="task-items">
                        {openTasks.map(task => {
                            const animOut = animatingId === task.id ? ' animate-out animating' : '';
                            const animIn = recentToggledId === task.id ? ' animate-in' : '';
                            return (
                                <div
                                    key={task.id}
                                    className={`task-item flex-row${animOut}${animIn}`}
                                    onClick={(e) => handleTaskClick(task, e)}
                                >
                                    <div className="task-content">
                                        <div className="task-title">{task.title}</div>
                                        <div className="task-description">{task.description}</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={false}
                                        onChange={() => handleToggleTask(task.id, false)}
                                        className="task-checkbox"
                                        disabled={!!animatingId}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTask(task.id, false);
                                        }}
                                        className="delete-button"
                                        title="Удалить задачу"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
                
                <div className="task-column">
                    <h2 className="column-header">Completed Tasks</h2>
                    <div className="task-items">
                        {doneTasks.map(task => {
                            const animOut = animatingId === task.id ? ' animate-out animating' : '';
                            const animIn = recentToggledId === task.id ? ' animate-in' : '';
                            return (
                                <div
                                    key={task.id}
                                    className={`task-item flex-row completed${animOut}${animIn}`}
                                    onClick={(e) => handleTaskClick(task, e)}
                                >
                                    <div className="task-content">
                                        <div className="task-title">{task.title}</div>
                                        <div className="task-description">{task.description}</div>
                                    </div>
                                    <input
                                        type="checkbox"
                                        checked={true}
                                        onChange={() => handleToggleTask(task.id, true)}
                                        className="task-checkbox"
                                        disabled={!!animatingId}
                                    />
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteTask(task.id, true);
                                        }}
                                        className="delete-button"
                                        title="Удалить задачу"
                                    >
                                        ✕
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <Modal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleAddTask}
            />
            
            {selectedTask && (
                <TaskModal
                    task={selectedTask}
                    isOpen={isTaskModalOpen}
                    onClose={() => {
                        setIsTaskModalOpen(false);
                        setSelectedTask(null);
                    }}
                    onSave={handleSaveTask}
                />
            )}
        </>
    );
};

export default HomePage;
