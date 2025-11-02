import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, onSubmit }) => {
    const [formData, setFormData] = React.useState({
        title: '',
        description: '',
        content: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        setFormData({ title: '', description: '', content: '' });
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Добавить новую задачу</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Название:</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="description">Краткое содержание:</label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="content">Основной текст:</label>
                        <textarea
                            id="content"
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="modal-buttons">
                        <button type="submit" className="btn btn-primary">
                            Добавить
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>
                            Отмена
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;