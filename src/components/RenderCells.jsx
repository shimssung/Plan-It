import React, { useEffect, useState } from 'react';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import styles from '../assets/styles/common/Calendar.module.scss';
import Modal from "../assets/styles/common/Modal.module.scss";
import DragDropEventpage from "./DragDropEventpage";

function RenderCells(props) {
    const { currentMonth, selectedDate, onDateClick, eventDatas, showEventView } = props;

    const monthStart = startOfMonth(currentMonth);     // 현재 달의 시작 날짜
    const monthEnd = endOfMonth(monthStart);         // 현재 달의 마지막 날짜
    const startDate = startOfWeek(monthStart);        // 현재 달의 시작 날짜가 포함된 주의 시작 날짜, 이전 달의 마지막 주 의 날짜
    const endDate = endOfWeek(monthEnd);            // 현재 달의 마지막 날짜가 포함된 주의 끝 날짜
    const [nowDay, setNowDay] = useState("");                   // 오늘 날짜
    const [hoveredEvents, setHoveredEvents] = useState([]);    // 상태: 호버된 날짜의 이벤트들
    const [isModalVisible, setIsModalVisible] = useState(false); // 상태: 모달 표시 여부
    const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 }); // 모달 위치 상태
    const [showDropmodal, setShowDropModal] = useState(false);
    const [dropEventData, setDropEventData] = useState([]);

    useEffect(() => {
        setNowDay(format(new Date(), 'yyyy-MM-dd'));            // 오늘날짜 포맷
    }, []);

    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = '';

    // 특정 날짜에 해당하는 모든 이벤트를 반환
    const findEventsForDate = (date) => {
        return eventDatas.filter(event => event.day === format(date, 'yyyy-MM-dd'));
    };

    const handleMouseEnter = (date, e) => {
        const eventsForDay = findEventsForDate(date); // 해당 날짜에 대한 이벤트 데이터 찾기
        setHoveredEvents(eventsForDay); // 모달에 표시할 이벤트 데이터 저장
        setIsModalVisible(true); // 모달을 표시

        // 날짜 셀의 위치를 계산 (e.target.closest('.cell')로 셀 요소를 찾음)
        const cell = e.target.closest(`.${styles.cell}`); // 가장 가까운 '.cell' 클래스 요소 찾기
        console.log(cell); // cell 요소가 제대로 찾혔는지 확인하기 위한 로그

        if (cell) {  // cell이 null이 아닐 때만 실행
            const { top, left, width } = cell.getBoundingClientRect();  // 날짜 셀의 위치 계산

            // 모달이 화면을 넘어가지 않도록 왼쪽으로 위치를 조정
            const modalLeft = left + width + 10;  // 셀 오른쪽으로 10px 여유 공간 추가
            const modalTop = top;  // 날짜 셀 아래로 10px 여유 공간 추가

            // 화면 너비를 넘지 않도록 처리
            const adjustedLeft = modalLeft + 210 > window.innerWidth ? left - 210 - 10 : modalLeft;  // 300은 모달 너비로 가정
            const adjustedTop = modalTop + 180 > window.innerHeight ? top - 50 : modalTop;
            setModalPosition({
                top: adjustedTop,
                left: adjustedLeft
            });
        }
    };

    // 날짜 셀에서 드롭을 허용하는 로직 추가
    const handleDragOver = (e) => {
        e.preventDefault();  // 드롭을 허용하려면 반드시 호출해야 함
    };

    // 드롭된 이벤트 데이터를 처리하는 함수
    const handleDrop = (e) => {
        e.preventDefault();

        const eventData = JSON.parse(e.dataTransfer.getData("application/json"));
        console.log("드롭된 이벤트:", eventData);
        setDropEventData(eventData);
        setShowDropModal(true);
        
    };

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, 'd');

            const cloneDay = day;
            const dayId = format(day, 'yyyy-MM-dd');
            const eventsForDay = findEventsForDate(day);    // 해당 날짜에 속하는 데이터들

            days.push(
                <div
                    className={`${styles.col} ${styles.cell} ${!isSameMonth(day, monthStart)
                        ? styles.disabled
                        : isSameDay(day, selectedDate)
                            ? styles.selected
                            : isSameDay(day, nowDay)
                                ? styles.nowday
                                : styles.valid
                        }`}
                    key={dayId}
                    onClick={() => {
                        setIsModalVisible(false)
                        onDateClick(cloneDay, dayId)                        
                    }}
                    onMouseEnter={(e) => handleMouseEnter(dayId, e)}
                    onDrop={(e) => handleDrop(e)}  // 드롭 이벤트 추가
                    onDragOver={handleDragOver}  // 드래그 오버 이벤트 추가
                >
                    <span className={!isSameMonth(day, monthStart) ? styles['not-valid'] : ''}>
                        {formattedDate}
                    </span>
                    {eventsForDay.length > 0 && (
                        <div className={styles.eventsContainer}>
                            {eventsForDay.map((event, index) =>
                                index < 2 ? (
                                    <div className={styles.eventcontent} key={event.id}>
                                        <div>
                                            <label className={`${styles.eventpoint}`} style={{ backgroundColor: event.color }}></label>
                                        </div>
                                        <div>
                                            <button
                                                className={`btn ${styles.eventcellBtn} ${isSameDay(cloneDay, selectedDate) ? styles.selectedBtn : styles.notselectedBtn} ${showEventView ? styles.showEventViewBtn : ""}`}
                                            >
                                                {event.title}
                                            </button>
                                        </div>
                                    </div>
                                ) : null
                            )}
                            {eventsForDay.length > 2 && (
                                <div className={styles.eventcontent}>
                                    <button
                                        className={`btn ${styles.morebtn} ${showEventView ? styles.showEventViewBtn : ""} ${isSameDay(day, selectedDate) ? ` ${styles.selectedBtn} btn-dark` : styles.notselectedBtn}`}
                                        disabled
                                    >
                                        + {eventsForDay.length - 2}개
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            );
            day = addDays(day, 1);
        }
        rows.push(
            <div className={styles.row} key={day}>
                {days}
            </div>
        );
        days = [];
    }

    // 모달 컴포넌트
    const renderModal = () => {
        if (!isModalVisible || hoveredEvents.length === 0) return null;

        return (
            <div className={styles.eventmodal} style={{ position: "absolute", zIndex: '1000', top: `${modalPosition.top}px`, left: `${modalPosition.left}px` }}>
                <div className={styles.modalContent}>
                    <div style={{ display: 'flex', width: '100%' }}>
                        <h5>{format(hoveredEvents[0]?.day, 'yyyy년 M월 dd일')}</h5>
                        <button style={{ marginLeft: '10px', height: '25px', borderStyle: 'none', backgroundColor: 'white', fontSize: '20px', alignSelf: 'flex-start' }}
                            onClick={() => { setIsModalVisible(false) }}
                        >x</button>
                    </div>
                    <ul style={{ paddingLeft: "10px" }}>
                        {hoveredEvents.map(event => (
                            <li key={event.id} style={{ color: event.color, overflow: 'hidden', height: '24px' }}>
                                {event.title}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        );
    };

    return (
        <div className={styles.body}>
            {rows}
            {renderModal()}  {/* 모달 렌더링 */}
            {showDropmodal && (
                <>
                    <div className={`${Modal["modal-overlay"]}`} onClick={() => setShowDropModal(false)}></div>
                    <div className={`${Modal.modal}`}>
                        <DragDropEventpage setShowDropModal={setShowDropModal}
                            dropEventData={dropEventData}

                        />
                    </div>
                </>
            )}
        </div>
    );
}

export default RenderCells;
