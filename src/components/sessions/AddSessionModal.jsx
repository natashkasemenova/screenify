import React, { useState, useEffect } from 'react';
import { IoMdClose } from "react-icons/io";
import './AddSessionModal.css';
import { getGenreIdByName } from '../../utils/genreUtils';

const API_URL = "https://screenify-fzh4dgfpanbrbeea.polandcentral-01.azurewebsites.net/api";

const AddSessionModal = ({ isOpen, onClose, onSave, editingSession }) => {
    const [sessionData, setSessionData] = useState({
        movieTitle: '',
        image: '',
        genres: [],
        duration: '',
        date: '',
        time: '',
        roomName: '',
        price: '',
        ticketTypes: [{ type: '', price: '' }]
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [movies, setMovies] = useState([]);
    const [rooms, setRooms] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            fetchMoviesAndRooms();
            if (editingSession) {
                const dateTime = new Date(editingSession.startTime);
                setSessionData({
                    id: editingSession.id || null,
                    movieTitle: editingSession.movieTitle || '',
                    image: editingSession.image || '',
                    genres: Array.isArray(editingSession.genres) ? editingSession.genres : [],
                    duration: editingSession.duration || '',
                    date: dateTime.toISOString().split('T')[0],
                    time: dateTime.toTimeString().slice(0, 5),
                    roomName: editingSession.roomName || '',
                    price: editingSession.price || '',
                    ticketTypes: editingSession.ticketTypes || [{ type: '', price: '' }],
                });
                setImagePreview(editingSession.image || null);
            } else {
                resetForm();
            }
        }
    }, [isOpen, editingSession]);

    const fetchMoviesAndRooms = async () => {
        const token = localStorage.getItem('accessToken');
        try {
            const [moviesResponse, roomsResponse] = await Promise.all([
                fetch(`${API_URL}/movies`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }),
                fetch(`${API_URL}/rooms`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            ]);

            if (!moviesResponse.ok || !roomsResponse.ok) {
                throw new Error('Failed to fetch data');
            }

            const [moviesData, roomsData] = await Promise.all([
                moviesResponse.json(),
                roomsResponse.json()
            ]);

            setMovies(moviesData);
            setRooms(roomsData);
        } catch (err) {
            setError('Failed to load movies and rooms');
            console.error(err);
        }
    };

    const resetForm = () => {
        setSessionData({
            movieTitle: '',
            image: '',
            genres: [],
            duration: '',
            date: '',
            time: '',
            roomName: '',
            price: '',
            ticketTypes: [{ type: '', price: '' }]
        });
        setImagePreview(null);
        setError('');
    };

    const handleSave = async () => {
        if (!sessionData.movieTitle || !sessionData.roomName || !sessionData.date || !sessionData.time || !sessionData.price) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            const selectedMovie = movies.find(m => m.title === sessionData.movieTitle);
            const selectedRoom = rooms.find(r => r.name === sessionData.roomName);

            if (!selectedMovie || !selectedRoom) {
                setError('Invalid movie or room selection');
                return;
            }

            const startTime = `${sessionData.date}T${sessionData.time}:00`;

            const formattedData = {
                id: sessionData.id,
                movieId: selectedMovie.id,
                roomId: selectedRoom.id,
                startTime: startTime,
                price: parseFloat(sessionData.price)
            };

            await onSave(formattedData);
            onClose();
            resetForm();
        } catch (err) {
            setError('Failed to save session');
            console.error(err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSessionData(prev => ({ ...prev, image: reader.result }));
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="session-modal-content">
                <button className="close-button" onClick={onClose}>
                    <IoMdClose />
                </button>
                
                {error && <div className="error-message">{error}</div>}

                <div className="modal-body">
                    <div className="image-section">
                        <div className="image-upload-container">
                            {imagePreview ? (
                                <img src={imagePreview} alt="Movie preview" className="image-preview" />
                            ) : (
                                <div className="image-placeholder">
                                    <input type="file" accept="image/*" onChange={handleImageChange} id="image-upload" />
                                    <label htmlFor="image-upload">Click to upload image</label>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="details-section">
                        <div className="input-group">
                            <label htmlFor="title">Title</label>
                            <input 
                                id="title"
                                type="text"
                                list="movies-list"
                                value={sessionData.movieTitle}
                                onChange={(e) => setSessionData(prev => ({ ...prev, movieTitle: e.target.value }))}
                            />
                            <datalist id="movies-list">
                                {movies.map(movie => (
                                    <option key={movie.id} value={movie.title} />
                                ))}
                            </datalist>
                        </div>

                        <div className="input-group">
                            <label>Genre</label>
                            <input 
                                type="text" 
                                value={sessionData.genres.map(g => (typeof g === 'object' ? g.name : g)).join(', ')}
                                onChange={(e) => {
                                    const genreNames = e.target.value.split(',').map(name => name.trim());
                                    setSessionData(prev => ({
                                        ...prev,
                                        genres: genreNames.map(name => {
                                            const genreId = getGenreIdByName(name);
                                            return genreId ? { id: genreId, name } : { name };
                                        })
                                    }));
                                }}
                            />
                        </div>

                        <div className="input-group">
                            <label>Duration</label>
                            <input 
                                type="text" 
                                value={sessionData.duration} 
                                onChange={(e) => setSessionData(prev => ({ ...prev, duration: e.target.value }))} 
                                placeholder="2h 30min" 
                            />
                        </div>

                        <div className="date-time-section">
                            <label>Date & Time</label>
                            <div className="date-time-inputs">
                                <input 
                                    type="date" 
                                    value={sessionData.date}
                                    onChange={(e) => setSessionData(prev => ({ ...prev, date: e.target.value }))}
                                />
                                <input 
                                    type="time" 
                                    value={sessionData.time}
                                    onChange={(e) => setSessionData(prev => ({ ...prev, time: e.target.value }))}
                                />
                            </div>
                        </div>

                        <div className="input-group">
                            <label>Room</label>
                            <input
                                type="text"
                                list="rooms-list"
                                value={sessionData.roomName}
                                onChange={(e) => setSessionData(prev => ({ ...prev, roomName: e.target.value }))}
                            />
                            <datalist id="rooms-list">
                                {rooms.map(room => (
                                    <option key={room.id} value={room.name} />
                                ))}
                            </datalist>
                        </div>

                        <div className="input-group">
                            <label>Price</label>
                            <input
                                type="number"
                                min="0"
                                step="0.01"
                                value={sessionData.price}
                                onChange={(e) => setSessionData(prev => ({ ...prev, price: e.target.value }))}
                            />
                        </div>
                            
                    
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="cancel-button" onClick={onClose}>Cancel</button>
                    <button className="save-button" onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    );
};

export default AddSessionModal;