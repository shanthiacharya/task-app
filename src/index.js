import React from 'react';
import ReactDOM from 'react-dom';
import initialData from './initial-data';
import styled from 'styled-components';
import {DragDropContext,Droppable} from 'react-beautiful-dnd';
import Column from './column';

const Container = styled.div `
    display:flex;
`
class App extends React.Component {
    state = initialData;

    onDragEnd = result => {

        
        //Persist the  reorder of column
        const {destination, source, draggableId,type} = result;
        // if dropped outside
        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index 
        ){
            return;
        }

        if(type === 'column') {
            const newColumnOrder = Array.from(this.state.columnOrder);
            newColumnOrder.splice(source.index,1);
            newColumnOrder.splice(destination.index,0,draggableId)
            const newState = {
                ...this.state,
                columnOrder: newColumnOrder,
            }
            this.setState(newState);
            return;
        }

        
        // get the column array
        const start = this.state.columns[source.droppableId];
        const finish = this.state.columns[destination.droppableId];

        if (start === finish) {

            //Create new array from  the taskid array
            const newTaskIds = Array.from(start.taskIds)
    
            // Use splice - from this index remove 1 item
            newTaskIds.splice (source.index,1)
    
            // Use splice again - destination - insert draggbleId
            newTaskIds.splice (destination.index,0,draggableId)
    
            // create new column same properties with new task array
            //Use spread operator to preserve the column properties
            const newColumn = {
                ...start,
                taskIds: newTaskIds,
            };
            
    
            // Put that into the new state state with overriding the columns
            // column: columnid & object
            const newState = {
                ...this.state,
                columns: {
                    ...this.state.columns,
                    [newColumn.id]: newColumn,
                },
            };
    
            //Update the state
    
            this.setState(newState);
            return;
        }
        // Moving from one list to another

        const startTaskIds = Array.from(start.taskIds);
        startTaskIds.splice(source.index,1);
        const newStart = {
            ...start,
            taskIds:startTaskIds,
        }

        const finishTaskIds = Array.from(finish.taskIds);
        finishTaskIds.splice(destination.index,0,draggableId);
        const newFinish = {
            ...finish,
            taskIds:finishTaskIds,
        }
        const newState = {
            ...this.state,
            columns: {
                ...this.state.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            }
        };
        this.setState(newState);

      

    };

    render() {
        return ( 
         <DragDropContext onDragEnd = {this.onDragEnd}>
            <Droppable 
              droppableId="all-columns" 
              direction="horizontal"
              type= "column"
              >
                {(provided) => (
                <Container
                {...provided.droppableProps}
                ref={provided.innerRef}
                >
                { this.state.columnOrder.map((columnId,index) => {
                    const column = this.state.columns[columnId];
                    const tasks = column.taskIds.map (taskId => this.state.tasks[taskId]);
                    return <Column key={column.id} column={column} tasks={tasks} index={index}/>
                    })}
                    {provided.placeholder}
                </Container>
                )}
            </Droppable>
        </DragDropContext>
        );
        
    }
}



ReactDOM.render(<App />, document.getElementById('root'));


