
import styles              from '../assets/styles/common/Event.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash }         from '@fortawesome/free-solid-svg-icons';


function TodoList(props) {
    const {data, onDelete, dateId} = props;

    console.log("리스트에서 받는 날짜 " + dateId);
    
    
    return (
        <div>
            {data.length === 0 ?
            <div style={{ display:'flex', justifyContent:'center' }}>
                <div>
                    <button className="btn btn-dark mb-3 " style={{ height: '60px', width : '43vw' ,marginLeft:'15px'}}>
                        이벤트를 추가해주세요!!
                    </button> 
                </div>
            </div>
            : data.map((event) => {
                return (
                    <div key={event.id}
                         className={`mb-3 ${styles.TodoListcontainer}`}>
                            <div>
                                <label className={`${styles.eventlabelpoint}`}
                                       style={{ backgroundColor: event.color }} >   {/* // 색상 속성에 맞게 스타일 설정 */}
                                     
                                </label>
                            </div>
                            <div >
                                
                                <button className={`btn btn-light ${styles.Todotitle} `}
                                        // onClick={() => navigate(`/EventUpdate/${event.id}`, { state: { currentMonth, dateId} })}
                                        onClick={() => props.UpdateModal(event.id)}
                                        >
                                    {event.title}
                                </button>
                            </div>
                            <div>
                            <button className={`btn btn-outline-danger ${styles.deleteTodo}`}
                                    onClick={() => onDelete(event.id, event.title)}>
                                    <FontAwesomeIcon icon={faTrash} style={{ fontSize:'24px' }} />
                            </button>
                            </div>
                        
                    </div>
                    
                );
            })}
        </div>
    )
    
}
export default TodoList;
