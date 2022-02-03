import React, { useEffect, useState } from 'react';
import imgAdd from '../img/add.svg';
import imgStage0 from '../img/taskStage-0.svg'
import imgStage1 from '../img/taskStage-1.svg'
import imgStage2 from '../img/taskStage-2.svg'
import imgDelete from '../img/delete.svg';
import TaskDataService from '../services/task-service';
import './Listitem.css';

const imgStages = [imgStage0, imgStage1, imgStage2];

function Listitem(props) {
    const [exists, setExists] = useState(props.exists);
    const [isNew, setNew] = useState(props.isNew);
    const [taskStage, setTaskStage] = useState(props.taskStage);
    const [taskText, setTaskText] = useState(props.text);
    const [isTyping, setTyping] = useState(props.typing);
    const [ogText, setOgText] = useState(props.text);

    function updateTask(data) {
        if (isNew) {
            if (data.stage !== undefined) { return; }
            if (data.text === undefined || !data.text.replace(/\s/g, "").length) {
                setTaskText("");
                setExists(false);
                return;
            }
            else {
                try {
                    TaskDataService.createTask(
                        {
                            userId: props.user._id,
                            checklistId: props.checklist._id,
                            text: data.text,
                            stage: 0
                        }
                    ).then(props.addTask);
                } catch (e) { console.log(`Failed create task, ${e}`); }
                return;
            }
        }
        if (data.text !== undefined) {
            setTyping(false);
            if (data.text == ogText) { return; }
            if (!data.text.replace(/\s/g, "").length) { return; }
            setOgText(data.text);
            setTaskText(data.text);
        }
        if (data.stage !== undefined) {
            setTaskStage(data.stage);
        }
        try {
            TaskDataService.updateTask(
                {
                    _id: props.task._id,
                    userId: props.user._id,
                    text: data.text !== undefined ? data.text : taskText,
                    stage: data.stage !== undefined ? data.stage : taskStage
                }
            );
        } catch (e) { console.log(`failed to update task, ${e}`); }
    }

    const deleteTask = () => {
        if (isNew) { return; }
        try {
            const taskId = { userId: props.user._id, taskId: props.task._id }
            TaskDataService.deleteTask(taskId).then(props.removeTask);
        } catch (e) { console.log(`failed to delete task, ${e}`) }
    }

    const checkmark = <div className={`checkmark`} onClick={() => updateTask({ stage: (taskStage + 1) % 3 })}>
        <img src={imgStages[taskStage]} className={"unselectable"} style={{ width: "100%" }} />
    </div>;
    const deleteButton = <img className="delete-button unselectable" src={imgDelete} alt="" onClick={deleteTask} />;
    const box_preexisting = <div className="preexisting" onClick={() => setExists(!exists)} />;
    const textInput = (
        <div className="input-container">
            <input className="input"
                defaultValue={taskText}
                onBlur={(e) => updateTask({ text: e.target.value })}
                onKeyDown={(e) => { if (e.key === 'Enter') { updateTask({ text: e.target.value }) } }}
                placeholder="New Task"
                spellCheck={false}
                autoFocus
            />
        </div>
    )
    const textTyped = (
        <div className="box-text typed" onClick={() => setTyping(true)}>
            <p >{taskText}</p>
        </div>
    );

    const box_existing = (
        <div className="listitem">
            {checkmark}
            {isTyping ? textInput : textTyped}
            {deleteButton}
        </div>
    );

    return <>{exists ? box_existing : box_preexisting}</>;
}

export default Listitem;
