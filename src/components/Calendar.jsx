import React, { useState, useEffect } from 'react';
import { addMonths, subMonths, format } from 'date-fns';
import RenderHeader from './RenderHeader';
import RenderDays from './RenderDays';
import RenderCells from './RenderCells';
import Calendarstyles from '../assets/styles/common/Calendar.module.scss';
import Eventstyles from '../assets/styles/common/Event.module.scss';
import EventView from "./EventView";
import TodoList from "./TodoList";
import TodoAddBtn from "./TodoAddBtn";
import { ko } from 'date-fns/locale';
import api from "./api/axios";
import TodoWritePage from "./TodoWritePage";
import Modal from "../assets/styles/common/Modal.module.scss";
import EventUpdate from "./EventUpdate";
import LastEvents from './LastEvnets';

function Calendar() {
    const [currentMonth, setCurrentMonth] = useState(new Date());                         // 월 ex) Tue Sep 03 2024 00:00:00 GMT+0900 (한국 표준시), state가 있다면 해당한는 월을 띄워준다
    const [selectedDate, setSelectedDate] = useState(new Date());                                                         // 선택한 년,월,일
    const [dateId, setDateId] = useState(format(new Date(), 'yyyy-MM-dd'));                                   // 초기 dateId 설정
    const [eventData, setEventData] = useState([]);                                                             // 내가 선택한 날짜에 해당하는 데이터들
    const [eventDatas, setEventDatas] = useState([]);                                                             // 모든 이벤트 데이터
    const [showEventView, setShowEventView] = useState(false);                                     // EventView 표시 여부 관리, state가 있다면 !!를 이용해 true반환, 아닐시 false반환
    const [showmodal, setShowModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [listId, setListId] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            const historyYear = format(currentMonth, 'yyyy');
            const historyMonth = format(currentMonth, 'MM');
            const historydata = {
                solYear: historyYear,
                solMonth: historyMonth
            };

            await getHistoryData(historydata);  // 공휴일 API 데이터를 먼저 가져옴
            const currentYearMonth = format(currentMonth, 'yyyy-MM');
            await getEventData(currentYearMonth);  // 공휴일 데이터 처리 후 이벤트 데이터 가져옴
        };

        fetchData();
    }, [currentMonth]);

    // 현재 월에 해당하는 공유일 API 호출
    const getHistoryData = async (historydata) => {
        console.log("공휴일 API 호출");
        try {
            const response = await api.get(`api/history`, { params: historydata });
            console.log("debug >>> axios get response data : ", response);

        } catch (err) {
            console.log(err);
        }
    }

    // 현재 월에 해당하는 모든 데이터 가져오기
    const getEventData = async (currentYearMonth) => {

        console.log("불러오는중");
        try {
            const response = await api.get(`events/index/${currentYearMonth}`);
            setEventDatas(response.data);
            // getData(dateId);
            // console.log(response.data);
            // console.log(currentYearMonth);


        } catch (err) {
            console.log(err);
        }
    };

    // dateId가 변경될 때마다 getDate(dateId) 즉, 해당 날짜(일자)에 해당하는 데이터 가져와 eventdata에 넣기
    useEffect(() => {
        getData(dateId);
    }, [dateId]);

    const getData = async (dateId) => {
        try {
            const response = await api.get(`events/viewday/${dateId}`);
            setEventData(response.data);
            // console.log(response.data);
            // console.log(dateId);



        } catch (err) {
            console.log(err);
        }


    };

    // 이전 달 버튼 핸들러러(RenderHeader에서 호출)
    const prevMonth = () => {
        setCurrentMonth(subMonths(currentMonth, 1));
    };

    // 다음 달 버튼 핸들러(RenderHeader에서 호출)
    const nextMonth = () => {
        setCurrentMonth(addMonths(currentMonth, 1));
    };

    // RenderCells에서 누른 날짜를 받아서 필요한 컨포넌트들에게 보냄
    const onDateClick = (day, id) => {
        setDateId(id);          // 여기에 전달된 id는 yyyy-MM-dd 형식
        setSelectedDate(day);   // ex) Tue Sep 03 2024 00:00:00 GMT+0900 (한국 표준시)
        setShowEventView(true); // 날짜 클릭 시 EventView 표시
    };

    // EventView에 있는 x버튼 눌럿을때 EventView를 다시 보이지 않게
    const toggleEventView = () => {
        setShowEventView(!showEventView);
    }

    // TodoList에서 올려받은 인자값으로 해당 데이터 삭제
    const DeleteHandler = async (id, title) => {
        try {
            if (window.confirm(`${title}을(를) 삭제하시겠습니까?`)) {
                await api.delete(`/events/delete/${id}`);
                getData(dateId);
                const currentYearMonth = format(currentMonth, 'yyyy-MM');
                getEventData(currentYearMonth); // 전체 이벤트 데이터를 갱신하여 RenderCells에도 반영
            }

        } catch (err) {
            console.error(err);
        }
    };

    const addModal = () => {
        setShowModal(true);
    }

    const UpdateModal = (listId) => {
        setListId(listId);
        setShowUpdateModal(true);
    }

    // 년, 월, 일 원하는 형식으로 포멧
    const currentYear = format(selectedDate, 'yyyy');
    const currentMonthFormatted = format(selectedDate, 'M');
    const currentDay = format(selectedDate, 'd');
    const currentWeekday = format(selectedDate, 'EEEE', { locale: ko });     // 요일 한글화

    return (
        <div className={`${Calendarstyles.container} `}>
            <div className={`${Calendarstyles.calendar}`}>
                <RenderHeader
                    currentMonth={currentMonth}
                    prevMonth={prevMonth}
                    nextMonth={nextMonth}
                />
                <RenderDays showEventView={showEventView} />
                <RenderCells
                    currentMonth={currentMonth}
                    selectedDate={selectedDate}
                    onDateClick={onDateClick}
                    eventDatas={eventDatas}
                    showEventView={showEventView}

                />
            </div>

            {showEventView && (
                <div>
                    <div className={`${Eventstyles.eventview} ${showEventView ? Eventstyles.active : ''}`}>
                        <EventView currentMonth={currentMonth}
                            currentMonthFormatted={currentMonthFormatted}
                            currentDay={currentDay}
                            currentWeekday={currentWeekday}
                            currentYear={currentYear}
                            showEventView={showEventView}
                            toggleEventView={toggleEventView} />
                        <TodoList data={eventData}
                            onDelete={DeleteHandler}
                            currentMonth={currentMonth}
                            dateId={dateId}
                            UpdateModal={UpdateModal} />
                        <TodoAddBtn dateId={dateId}
                            currentMonth={currentMonth}
                            addModal={addModal} />
                    </div>
                    <div>
                        <LastEvents eventDatas={eventDatas}/>
                    </div>
                </div>

            )}

            {showmodal && (
                <>
                    <div className={`${Modal["modal-overlay"]}`} onClick={() => setShowModal(false)}></div>
                    <div className={`${Modal.modal}`}>
                        <TodoWritePage setShowModal={setShowModal}
                            dateId={dateId}
                            currentMonth={currentMonth}
                            getEventData={getEventData}
                            getData={getData}
                        />
                    </div>
                </>
            )}

            {showUpdateModal && (
                <>
                    <div className={`${Modal["modal-overlay"]}`} onClick={() => setShowUpdateModal(false)}></div>
                    <div className={`${Modal.modal}`}>
                        <EventUpdate setShowUpdateModal={setShowUpdateModal}
                            dateId={dateId}
                            currentMonth={currentMonth}
                            getEventData={getEventData}
                            listId={listId}
                            getData={getData}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Calendar;
