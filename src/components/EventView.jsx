import { format } from 'date-fns';
import styles     from '../assets/styles/common/Event.module.scss';

function EventView(props) {
    const {currentMonth, currentDay, currentMonthFormatted , currentYear, currentWeekday, toggleEventView} = props;
    return (
        <div>
            <div className={`${styles.header}`}>
                <div className={` ${styles.col} ${styles['col-start']}`}>
                        <span className={styles.text}>
                            <span className={styles['text-month']}>
                                {format(currentMonth, 'M')}월
                            </span>
                            <span className={styles['text-year']}>
                                {format(currentMonth, 'yyyy')}
                            </span>
                        </span>
                </div>
                <div className={`${styles.col} ${styles['col-end']}`}>
                    <div>
                        <button className={`btn btn-outline-light ${styles.eventViewXbtn}`}
                                onClick={toggleEventView}>
                            X
                        </button>
                    </div>
                </div>
            </div>
            <div className={styles.eventtext}>
                        <span className={styles['event-text']}>
                            {currentYear}년
                        </span>
                        <span className={styles['event-text']}>
                            {currentMonthFormatted}월
                        </span>
                        <span className={styles['event-text']}>
                            {currentDay}일
                        </span>
                        <span className={styles['event-text']}>
                            {currentWeekday}
                        </span>
            </div>
        </div>



    )
}

export default EventView;

