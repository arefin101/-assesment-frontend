import { useEffect, useState } from 'react';
import './App.css';

function App() {

    const [modal, setModal] = useState("none");

    const [tasks, setTasks] = useState([]);

    const [todoList, setTodoList] = useState([]);

    const [inProgressList, setInProgress] = useState([]);

    const [doneList, setDoneList] = useState([]);

    const [submitData, setSubmitData] = useState({ name : '' });

    const [id, setId] = useState({ id : '' });

    const openModal = (id) => {
        setModal("block");
        setId(id);
    }


    const close = () => {
        setModal("none");
    }

    const updateLevel = (e, lv) => {
        
        e.preventDefault();

        const level = {
            level: lv
        }

        fetch(`http://localhost/assessment/api/update-task/${id}`,{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(level)
        })
        .then(response => response.json())
        .then(data => setTasks(state => state.map((el) => el.id === id
                        ? { ...el, level: lv }
                        : el,
            )),
            setModal("none")
        );
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch("http://localhost/assessment/api/add-task",{
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(submitData)
        })
        .then(response => response.json())
        .then(data => setTasks([...tasks, data.new_task]));

    }

    useEffect(()=>{

        fetch("http://localhost/assessment/api/task-list", {
              method: "get",
              headers: {
                  "Content-Type": "application/json",
              },
          })
        .then((response) => response.json())
        .then((data) => setTasks(data.tasks));
        
    }, []);

    useEffect(()=>{

        if(tasks.length > 0){
            setTodoList(tasks.filter(data => data.level === 0))
            setInProgress(tasks.filter(data => data.level === 1))
            setDoneList(tasks.filter(data => data.level === 2))
        }
        
    }, [tasks]);


    return (
        <div className="App">
            
            <div className="row">
                <form onSubmit={(e)=>handleSubmit(e)}>
                    <input 
                        type="text" 
                        className="add" 
                        placeholder="Write your task ..." 
                        onChange={(e)=>setSubmitData({name:e.target.value})}
                    />
                    <button className="add">Add</button>
                </form>
            </div>

            <div className="row">
                <div className="column">
                    <div className="card">
                        <div className="header">To Do</div>
                        {todoList.map(state => (
                            <div key={state.id}>
                                <p className="task" onClick={() => openModal(state.id)}>{state.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="column">
                    <div className="card">
                        <div className="header">In Progress</div>
                        {inProgressList.map(state => (
                            <div key={state.id}>
                                <p className="task" onClick={() => openModal(state.id)}>{state.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="column">
                    <div className="card">
                        <div className="header">Done</div>
                        {doneList.map(state => (
                            <div key={state.id}>
                                <p className="task" onClick={() => openModal(state.id)}>{state.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div id="myModal" className="modal" style={{display: `${modal}` }}>
                <div className="modal-content">
                    <span onClick={()=>close()} className="close">&times;</span>

                        <div className="selectBtn">
                            <button style={{padding:"5px 30px"}} onClick={(e) => updateLevel(e, 0)}>Todo</button>
                        </div>
                        <div className="selectBtn">
                            <button style={{padding:"5px 30px"}} onClick={(e) => updateLevel(e, 1)}>In Progress</button>
                        </div>
                        <div className="selectBtn">
                            <button style={{padding:"5px 30px"}} onClick={(e) => updateLevel(e, 2)}>Done</button>
                        </div>   
                </div>
            </div>

        </div>

    );
}

export default App;
