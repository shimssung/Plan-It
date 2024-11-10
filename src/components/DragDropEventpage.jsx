import { useState, useEffect } from "react";  // useEffect를 추가
import api from "./api/axios";
import { format } from 'date-fns';
import styled from "../assets/styles/common/TodoWrite.module.scss";
import Rainbow from "../assets/styles/images/Rainbow.jpg";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import KakaoMap from "./KakaoMap";

function DragDropEventpage(props) {
    const [title, setTitle] = useState('');
    const [content, setcCntent] = useState('');
    const [resturant, setResturant] = useState('');
    const [eventColor, setEvnetColor] = useState("red");

    // props.dropEventData가 변할 때마다 상태 업데이트
    useEffect(() => {
        if (props.dropEventData) {
            setTitle(props.dropEventData.title);
            setcCntent(props.dropEventData.content);
            setResturant(props.dropEventData.resturant || '');  // 주소가 없을 경우 빈 문자열로 처리
            setEvnetColor(props.dropEventData.color || "red");  // 색상이 없으면 기본값으로 red
        }
    }, [props.dropEventData]);

    const resturantHandler = (e) => {
        setResturant(e.target.value);
    }

    const titleHandler = (e) => {
        setTitle(e.target.value);
    }

    const contentHandler = (e) => {
        setcCntent(e.target.value);
    }

    const redBtn = () => {
        setEvnetColor("red");
    }

    const orangeBtn = () => {
        setEvnetColor("orange");
    }

    const greenBtn = () => {
        setEvnetColor("green");
    }

    const blueBtn = () => {
        setEvnetColor("blue");
    }

    const onsubmit = async () => {
        if (title.trim()) {
            const data = {
                day: props.dateId,
                title: title.trim(),
                content: content.trim(),
                color: eventColor
            };

            try {
                const response = await api.post(`/events/save`, data);
                console.log(response);
                alert("글 작성을 완료");
                props.getEventData(format(props.currentMonth, 'yyyy-MM'));
                props.getData(props.dateId);
                props.setShowDropModal(false);

            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <div className={styled.container}>
            <div className={styled.btncontainer}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <FontAwesomeIcon icon={faXmark} className={styled.xbutton}
                        onClick={() => {
                            props.setShowDropModal(false)
                        }} />
                </div>
                <div className={styled.eventcolor}>
                    <div style={{ marginBottom: '3px' }}>
                        <img src={Rainbow} alt="Rainbow" className={styled.rainbow} />
                    </div>
                    <div style={{ margin: '0' }}>
                        <label className={styled.eventcolorlabel}> 이벤트 색상 </label>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                        <button className={`${styled.colorbtn} ${eventColor === 'red' ? styled.selected : ''}`} style={{ backgroundColor: 'red', margin: '0' }} onClick={redBtn}></button>
                        &nbsp;&nbsp;
                        <button className={`${styled.colorbtn} ${eventColor === 'orange' ? styled.selected : ''}`} style={{ backgroundColor: 'orange', margin: '0' }} onClick={orangeBtn}></button>
                        &nbsp;&nbsp;
                        <button className={`${styled.colorbtn} ${eventColor === 'green' ? styled.selected : ''}`} style={{ backgroundColor: 'green', margin: '0' }} onClick={greenBtn}></button>
                        &nbsp;&nbsp;
                        <button className={`${styled.colorbtn} ${eventColor === 'blue' ? styled.selected : ''}`} style={{ backgroundColor: 'blue', margin: '0' }} onClick={blueBtn}></button>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faCalendar} className={styled.titleicon} style={{ color: eventColor, borderColor: eventColor }} />
                    <input type="text"
                        className={styled['content']}
                        style={{ height: '50px' }}
                        value={title}
                        placeholder="제목"
                        onChange={titleHandler} />
                </div>

                <div style={{ display: 'flex' }}>
                    <FontAwesomeIcon icon={faPenToSquare} className={styled.titleicon} style={{ marginTop: '8px' }} />
                    <input type="text"
                        className={styled['content']}
                        style={{ height: '100px' }}
                        value={content}
                        placeholder="내용"
                        onChange={contentHandler} />
                </div>
                <div style={{ display: 'flex' }}>
                    <FontAwesomeIcon icon={faLocationDot} className={styled.titleicon} style={{ marginTop: '8px' }} />
                    <input type="text"
                        className={styled['content']}
                        style={{ height: '40px' }}
                        value={resturant}
                        placeholder="주소"
                        onChange={resturantHandler} />
                </div>
                <div >
                    <KakaoMap resturant={resturant}></KakaoMap>
                </div>

                <div style={{ marginRight: '5px', display: 'flex', justifyContent: 'end' }}>
                    <button title="저장"
                        disabled={title.trim() ? false : true}
                        className={`btn btn-primary ${styled.TodoButton}`}
                        onClick={() => {
                            onsubmit();
                        }}>
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DragDropEventpage;
