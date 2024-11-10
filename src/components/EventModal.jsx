import React from 'react';
import styles from '../assets/styles/common/Calendar.module.scss';

const EventModal = ({ events, onClose }) => {
  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose}>X</button>
        <h3>Events on this day</h3>
        <div className={styles.eventList}>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className={styles.eventItem}>
                <div style={{ backgroundColor: event.color }} className={styles.eventPoint}></div>
                <span>{event.title}</span>
              </div>
            ))
          ) : (
            <p>No events for this day</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventModal;
