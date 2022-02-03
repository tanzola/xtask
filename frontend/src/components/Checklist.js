import React, { useState, useEffect } from "react";
import Listitem from './Listitem';
import ChecklistDataService from '../services/checklist-service';
import './Checklist.css';

function Checklist(props) {
    let user = props.user;

    const [numTasks, setNumTasks] = useState(0);
    const [numChanges, setNumChanges] = useState(0);
    const addTask = () => {
        setNumTasks(numTasks + 1);
        setNumChanges(numChanges + 1);
    }
    const removeTask = () => {
        setNumTasks(numTasks - 1);
        setNumChanges(numChanges + 1);
    }

    const [checklist, setChecklist] = useState({});
    useEffect(() => {
        ChecklistDataService.get({userId: props.user._id, checklistId: props.checklist._id})
        .then(function(res) {
            setChecklist(res.data);
            setNumTasks(res.data.tasks.length);
        })
    }, [numTasks]);
    
    const [listitems, setListitems] = useState(null);
    useEffect(() => {
        if (checklist.tasks) {
            const tasks = Array();
            checklist.tasks.map(task => (
                tasks.push(
                    <Listitem
                        exists={true}
                        isNew={false}
                        user={user}
                        task={task}
                        checklist={checklist}
                        text={task.text}
                        taskStage={task.stage}
                        typing={false}
                        key={task._id}
                        addTask={addTask}
                        removeTask={removeTask}
                    />
                )
            ));
            tasks.push(
                <Listitem
                    exists={false}
                    isNew={true}
                    user={user}
                    checklist={checklist}
                    text={""}
                    taskStage={0}
                    typing={true}
                    key={numChanges}
                    addTask={addTask}
                    removeTask={removeTask}
                />
            )
            setListitems(tasks);
        }
    }, [checklist, user]);
    
    return (
        <div className="checklist" key={checklist._id}>
            <div className="checklist-title"><p>{checklist.name}</p></div>
            {listitems}
        </div>
    )
}

export default Checklist;
