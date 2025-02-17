import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiFilter } from 'react-icons/fi';
import { IoSearch } from 'react-icons/io5';
import './Reviews.css';
import ReviewCard from './ReviewCard';

const API_URL = "https://screenify-fzh4dgfpanbrbeea.polandcentral-01.azurewebsites.net/api";

const Reviews = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        movieId: '',
        AppUserId: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchReviews = async () => {
            try {
                // Construct URL with query parameters if they exist
                let url = `${API_URL}/review`;
                const queryParams = [];
                
                if (filters.movieId) {
                    queryParams.push(`movieId=${filters.movieId}`);
                }
                if (filters.AppUserId) {
                    queryParams.push(`AppUserId=${filters.AppUserId}`);
                }
                
                if (queryParams.length > 0) {
                    url += `?${queryParams.join('&')}`;
                }

                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error loading reviews');
                }

                const reviewsData = await response.json();

                // Transform the data to match the ReviewCard component expectations
                const transformedReviews = reviewsData.map(review => ({
                    id: review.id,
                    userId: review.madeBy,
                    username: review.madeBy, // You might want to fetch user details separately
                    userImage: "/api/placeholder/74/74", // Placeholder image
                    movieId: review.movieId,
                    movieTitle: `Movie ${review.movieId}`, // You might want to fetch movie details separately
                    reviewText: review.comment,
                    rating: review.rating,
                    date: new Date(review.creationTime).toISOString().split('T')[0],
                    likes: review.likes
                }));

                setReviews(transformedReviews);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [navigate, filters]); // Add filters to dependency array to refetch when filters change

    const handleLogout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="loading">
                <p>Loading reviews...</p>
            </div>
        );
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="reviews-container">
            <nav className="top-nav">
                <div className="logo">
                    <span>screenify</span>
                </div>
                <ul className="nav-links">
                    <li><a href="/movies">Movies</a></li>
                    <li><a href="/sessions">Sessions</a></li>
                    <li><a href="/users">Users</a></li>
                    <li><a href="/rooms">Rooms</a></li>
                    <li><a href="/tickets">Tickets</a></li>
                    <li><a href="/reviews" className="active">Reviews</a></li>
                    <li><a href="/statistics">Statistics</a></li>
                    <li><button onClick={handleLogout} className="logout-btn">LOG OUT</button></li>
                </ul>
            </nav>

            <div className="content">
                <div className="reviews-header">
                    <h1>List of All Reviews</h1>
                    <div className="filters-section">
                        <div className="input-with-icon">
                            <IoSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="User ID"
                                name="AppUserId"
                                value={filters.AppUserId}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>
                        <div className="input-with-icon">
                            <IoSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Movie ID"
                                name="movieId"
                                value={filters.movieId}
                                onChange={handleFilterChange}
                                className="filter-input"
                            />
                        </div>
                    </div>
                </div>

                <div className="reviews-list">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Reviews;