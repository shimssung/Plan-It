

function TodoAddBtn(props) {

    const {dateId, currentMonth, addModal} = props;


    return (

        <div className="addbtncontainer" style={{display: 'flex', justifyContent: 'center'}}>
            <div>
                <button className="btn btn-secondary " style={{ height: '60px', width : '43vw', marginLeft:'15px'}}
                        onClick={() => {
                            console.log(dateId)
                            addModal()
                        }}> + 새로운 이벤트 </button>
                        
            </div>                    
        </div>
    );
}

export default TodoAddBtn;