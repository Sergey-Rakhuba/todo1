import React, { useState } from 'react';
import './TaskModal.css';

const TaskModal = ({ task, isOpen, onClose, onSave, onEdit }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTask, setEditedTask] = useState(task);

    if (!isOpen) return null;

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        onSave(editedTask);
        setIsEditing(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedTask(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="task-modal-overlay" onClick={onClose}>
            <div className="task-modal-content" onClick={e => e.stopPropagation()}>
                {isEditing ? (
                    // Режим редактирования
                    <>
                        <div className="form-group">
                            <label>Название:</label>
                            <input
                                type="text"
                                name="title"
                                value={editedTask.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Краткое описание:</label>
                            <input
                                type="text"
                                name="description"
                                value={editedTask.description}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label>Полное описание:</label>
                            <textarea
                                name="content"
                                value={editedTask.content}
                                onChange={handleChange}
                                rows="4"
                            />
                        </div>
                    </>
                ) : (
                    // Режим просмотра
                    <>
                        <h2>{task.title}</h2>
                        <div className="task-info">
                            <p className="task-description">{task.description}</p>
                            <div className="task-content">
                                <h3>Полное описание:</h3>
                                <p>{task.content}</p>
                            </div>
                            <div className="task-status-info">
                                <span>Статус: {task.isCompleted ? 'Выполнено' : 'Активно'}</span>
                            </div>
                        </div>
                    </>
                )}
                
                <div className="modal-buttons">
                    {isEditing ? (
                        <>
                            <button className="btn btn-primary" onClick={handleSave}>
                                Сохранить
                            </button>
                            <button className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                Отмена
                            </button>
                        </>
                    ) : (
                        <>
                            <button className="btn btn-primary" onClick={onClose}>
                                OK
                            </button>
                            <button className="btn btn-secondary" onClick={handleEdit}>
                                Редактировать
                            </button>
                            <button className="btn btn-secondary" onClick={onClose}>
                                Отмена
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TaskModal;