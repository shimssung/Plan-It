
import { useState, useEffect }     from "react";
import api                         from "./api/axios";
import styled                      from "../assets/styles/common/TodoWrite.module.scss";
import _                           from "lodash";
import { format }                  from 'date-fns';
import Rainbow                     from "../assets/styles/images/Rainbow.jpg";
import { FontAwesomeIcon }         from '@fortawesome/react-fontawesome';
import { faCalendar }              from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare }           from '@fortawesome/free-solid-svg-icons';
import { faXmark }                 from "@fortawesome/free-solid-svg-icons";

function EventUpdate(props) {

    const [ title, setTitle ]           = useState('');
    const [ content, setContent ]       = useState('');
    const [ event, setEvent ]           = useState({})
    const [ original, setOriginal ]     = useState({});
    const [ Completed, setCompleted ]   = useState(true);
    const [ eventColor, setEventColor ] = useState("");


    useEffect(() => {
        getEvent(props.listId);
    }, [props.listId]);

    useEffect(() => {
        setEvent({ title, content, eventColor });
    }, [title, content, eventColor]);
    
    // 기존 데이터와 비교(lodash 사용)
    useEffect(() => {
        // 기존 데이터와 새로운 데이터를 공백 제거 후 비교
        const eventData = { 
            title: event.title ? event.title.trim() : '',  // undefined 체크
            content: event.content ? event.content.trim() : '',  // undefined 체크
            color: eventColor
        };
        const originalData = { 
            title: original.title ? original.title.trim() : '',  // undefined 체크
            content: original.content ? original.content.trim() : '',  // undefined 체크
            color: original.color
        };
        
        setCompleted(_.isEqual(eventData, originalData)); // 공백 제거 후 비교
    }, [event, original, eventColor]);
    

    const getEvent = async(eventid) => {
        
        try {       
             // event?id=${eventid}로 적엇을때는 배열로 값이 들어왔엇음
            const response = await api.get(`events/gettodo/${eventid}`);
            const eventData = response.data;
            setEvent(eventData);                // 바뀐 데이터
            setOriginal(eventData);             // 기준 데이터(바뀐 데이터와 같은 확인하기 위함)
            setEventColor(eventData.color);     // 화면에 보여질때 기존 데이터의 컬러로 표시되도록
            setTitle(eventData.title);          // useState로 만들어서 value값으로 넣어줘야 본문도 변경가능함
            setContent(eventData.content);
        } catch (err) {
            console.log(err);
            
        }
    }

    const titleHandler = (e) => {
        setTitle(e.target.value) ;
    }

    const contentHandler = (e) => {
        setContent(e.target.value) ;
    }

    const redBtn = () => {
        setEventColor("red");
    }

    const orangeBtn = () => {
        setEventColor("orange");
    }

    const greenBtn = () => {
        setEventColor("green");
    }

    const blueBtn = () => {
        setEventColor("blue");
    }

    // update
    const onsubmit = async () => {
        if(title.trim()) {
            const data = {
                id      : props.listId,
                title   : title.trim(),
                content : content.trim(),
                color   : eventColor
            } ;
            
            
            try {
                await api.put(`/events/update`, data)
                // alert("수정을 완료하고 홈으로 이동합니다.")
                props.getEventData(format(props.currentMonth, 'yyyy-MM'));
                props.getData(props.dateId);
                props.setShowUpdateModal(false);
                // navigate("/", { state: { currentMonth, dateId} })
                
            } catch (err) {
                console.log(err);
                
            }
        }
    } 
    
    return (
        <div className={styled.container}>
            <div className={styled.btncontainer}>
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                        <FontAwesomeIcon icon={faXmark} className={styled.xbutton}
                                         onClick={() => {
                                            props.setShowUpdateModal(false)
                                        }}/>
                </div>
                <div className={styled.eventcolor}>
                    <div style={{ marginBottom : '3px' }}>
                        <img src={Rainbow} alt="Rainbow"  className={styled.rainbow}/>
                    </div>
                    <div style={{ margin : '0' }}>
                        <label className={styled.eventcolorlabel}> 이벤트 색상 </label>
                    </div>
                    &nbsp;&nbsp;&nbsp;
                    <div>
                        <button className={`${styled.colorbtn} ${eventColor === 'red' ? styled.selected : ''}`} style={{ backgroundColor : 'red', margin : '0' }} onClick={redBtn}></button>
                        &nbsp;&nbsp;
                        <button className={`${styled.colorbtn} ${eventColor === 'orange' ? styled.selected : ''}`} style={{ backgroundColor : 'orange', margin : '0' }} onClick={orangeBtn}></button>
                        &nbsp;&nbsp;
                        <button className={`${styled.colorbtn} ${eventColor === 'green' ? styled.selected : ''}`} style={{ backgroundColor : 'green', margin : '0' }} onClick={greenBtn}></button>
                        &nbsp;&nbsp;
                        <button className={`${styled.colorbtn} ${eventColor === 'blue' ? styled.selected : ''}`} style={{ backgroundColor : 'blue', margin : '0' }} onClick={blueBtn}></button>
                    </div>
                </div>

                <div style={{ display:'flex', alignItems:'center' }}>
                    <FontAwesomeIcon icon={faCalendar} className={styled.titleicon} style={{ color: eventColor, borderColor: eventColor}}/>
                    <input type="text"
                    className={styled['content']}
                    style={{ height : '50px' }}
                    value={title}
                    placeholder="제목"
                    onChange={titleHandler}/>
                </div>

                <div style={{ display:'flex' }}>
                    <FontAwesomeIcon icon={faPenToSquare} className={styled.titleicon} style={{ marginTop:'8px'}}/>
                    <input type="text"
                        className={styled['content']}
                        style={{ height : '100px' }}
                        value={content}
                        placeholder="내용"
                        onChange={contentHandler}/>
                </div>
                <div style={{ marginRight:'5px', display:'flex', justifyContent:'end'}}>
                    <button title="수정"
                            disabled={Completed || !title.trim()}
                            className={`btn btn-primary ${styled.TodoButton}`}
                            onClick={() => {
                                onsubmit();
                            }}>
                        수정
                    </button>

                    {/* <button title="취소"
                            className={`btn btn-danger col-1 ${styled.TodoButton}`}
                            onClick={() => {

                            }}>
                        취소
                    </button> */}
                </div>
            </div>  
        </div>
    );
}
export default EventUpdate;
