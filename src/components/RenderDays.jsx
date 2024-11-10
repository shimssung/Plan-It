import React  from 'react';
import styles from '../assets/styles/common/Calendar.module.scss';

function RenderDays (props) {
    const days = [];
    const date = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // 7개의 요일 div생성
    for (let i = 0; i < 7; i++) {
        days.push(
            <div className={styles.col} key={i}>
                {date[i]}
            </div>,
        );
    }



    return <div className={`${styles.days} ${props.showEventView ? styles.showEventViewdays : ""}`}>{days}</div> ;
};

export default RenderDays;
