import React from 'react';
import { IoMdClose } from "react-icons/io";
import styles from './MovieInfoModal.module.css';

const MovieInfoModal = ({ isOpen, onClose, movie }) => {
    if (!isOpen || !movie) return null;

    const formatGenres = (genres) => {
        if (!genres || !Array.isArray(genres)) return 'No genres specified';
        return genres.map(genre => 
            typeof genre === 'object' ? genre.name : genre
        ).join(', ');
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <IoMdClose />
                </button>
                
                <div className={styles.modalBody}>
                    <div className={styles.imageSection}>
                        <div className={styles.imageContainer}>
                            {movie.posterUrl ? (
                                <img 
                                    src={movie.posterUrl} 
                                    alt={movie.title} 
                                    className={styles.movieImage} 
                                />
                            ) : (
                                <div className={styles.imagePlaceholder}>
                                    No image available
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.detailsSection}>
                        <h2 className={styles.movieTitle}>{movie.title}</h2>
                        
                        <div className={styles.infoGroup}>
                            <span className={styles.infoLabel}>Genre</span>
                            <span className={styles.infoValue}>
                                {formatGenres(movie.genres)}
                            </span>
                        </div>

                        <div className={styles.infoGroup}>
                            <span className={styles.infoLabel}>Duration</span>
                            <span className={styles.infoValue}>
                                {movie.duration ? `${movie.duration} min` : 'Duration not specified'}
                            </span>
                        </div>

                        <div className={styles.castSection}>
                            <span className={styles.infoLabel}>Cast</span>
                            <div className={styles.castList}>
                                {movie.actors && movie.actors.length > 0 ? (
                                    movie.actors.map((actorInfo, index) => (
                                        <div key={index} className={styles.castItem}>
                                            <span className={styles.actorName}>
                                                {actorInfo.actor.name}
                                            </span>
                                            {actorInfo.characterName && (
                                                <span className={styles.roleName}>
                                                    as {actorInfo.characterName}
                                                </span>
                                            )}
                                            {actorInfo.roleName?.roleName && (
                                                <span className={styles.roleType}>
                                                    ({actorInfo.roleName.roleName})
                                                </span>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noCast}>
                                        No cast information available
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.closeButtonFooter} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MovieInfoModal;