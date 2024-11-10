import React                  from 'react';
import { format }             from 'date-fns';
import styles                 from '../assets/styles/common/Calendar.module.scss'
import { FontAwesomeIcon }    from '@fortawesome/react-fontawesome';
import { faSquareCaretRight } from '@fortawesome/free-solid-svg-icons';
import { faSquareCaretLeft }  from '@fortawesome/free-solid-svg-icons';


function RenderHeader (props) {

    const { currentMonth, prevMonth, nextMonth } = props ;

    return (
        <div className={`${styles.header} ${styles.row}`}>
                <button className={styles.button} onClick={prevMonth}><FontAwesomeIcon icon={faSquareCaretLeft} /></button>     {/* 왼쪽 화살표 아이콘 */}
                <span className={styles.text}>
                    <span className={styles['text-year']}>
                        {format(currentMonth, 'yyyy')}년
                    </span>
                    &nbsp;&nbsp;
                    <span className={styles['text-month']}>
                        {format(currentMonth, 'M')}월
                    </span>
                </span>
                <button className={styles.button} onClick={nextMonth}><FontAwesomeIcon icon={faSquareCaretRight} /></button>    {/* 오른쪽 화살표 아이콘 */}
        </div>
    );
};

export default RenderHeader;
