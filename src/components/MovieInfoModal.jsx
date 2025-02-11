import React from 'react';
import { IoMdClose } from "react-icons/io";
import styles from './MovieInfoModal.module.css';

const MovieInfoModal = ({ isOpen, onClose, movie }) => {
    if (!isOpen || !movie) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>
                    <IoMdClose />
                </button>
                
                <div className={styles.modalBody}>
                    <div className={styles.imageSection}>
                        <div className={styles.imageContainer}>
                            {movie.image ? (
                                <img src={movie.image} alt={movie.title} className={styles.movieImage} />
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
                            <span className={styles.infoValue}>{movie.genre}</span>
                        </div>

                        <div className={styles.infoGroup}>
                            <span className={styles.infoLabel}>Duration</span>
                            <span className={styles.infoValue}>{movie.duration}</span>
                        </div>

                        <div className={styles.castSection}>
                            <span className={styles.infoLabel}>Cast</span>
                            <div className={styles.castList}>
                                {movie.cast && movie.cast.map((member, index) => (
                                    <div key={index} className={styles.castItem}>
                                        <span className={styles.actorName}>{member.actor}</span>
                                        <span className={styles.roleName}>as {member.role}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.modalFooter}>
                    <button className={styles.closeButtonFooter} onClick={onClose}>Close</button>
                </div>
            </div>
        </div>
    );
};

export default MovieInfoModal;