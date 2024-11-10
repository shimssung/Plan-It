import { useEffect } from "react";


function LastEvents({ event, eventDatas }) {
    
    // 날짜 기준으로 일정 데이터 정렬
    const sortedEvents = [...eventDatas].sort((a, b) => new Date(a.day) - new Date(b.day));




    useEffect(() => {
        console.log(sortedEvents);
    }, [sortedEvents]);

    // 드래그 시작 이벤트 핸들러
    const handleDragStart = (e, eventData) => {
        // 드래그 데이터로 이벤트 데이터의 JSON 문자열 저장
        console.log(eventData);
        
        e.dataTransfer.setData("application/json", JSON.stringify(eventData));
    };

    return (
        <div style={{ backgroundColor: 'white', width: '85+%', marginLeft: '50px', borderRadius: '10px', marginTop: '50px' }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: 'black' }}>지난 일정들</div>
            <div style={{ overflow: 'auto', height: '32vh' }}>
                {sortedEvents.map((event) => (
                    <div
                    key={event.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, event)} // 드래그 시작 이벤트 추가
                    style={{ color: "black", border: '1px solid black', marginBottom: '5px', paddingLeft: '10px', cursor: 'pointer' }}
                >
                    {event.day} - {event.title}
                </div>
                ))}
            </div>
        </div>
    );
}

export default LastEvents;
