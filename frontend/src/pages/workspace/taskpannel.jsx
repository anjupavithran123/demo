import React, { useEffect, useState } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import api from '../../lib/api'

// Sample initial data (replace with API call later)
const initialColumns = [
  {
    id: 'col-1',
    title: 'To Do',
    tasks: [
      { id: 't1', title: 'Task 1' },
      { id: 't2', title: 'Task 2' },
    ],
  },
  {
    id: 'col-2',
    title: 'In Progress',
    tasks: [
      { id: 't3', title: 'Task 3' },
    ],
  },
  {
    id: 'col-3',
    title: 'Done',
    tasks: [],
  },
]

export default function TasksPanel({ workspaceId }) {
  const [columns, setColumns] = useState(initialColumns)

  useEffect(() => {
    // TODO: Fetch columns/tasks from API
    // api.get(`/workspaces/${workspaceId}/tasks`).then(res => setColumns(res.data))
  }, [workspaceId])

  const onDragEnd = (result) => {
    const { source, destination } = result
    if (!destination) return
    if (source.droppableId === destination.droppableId && source.index === destination.index) return

    const newColumns = [...columns]
    const sourceColIndex = newColumns.findIndex(c => c.id === source.droppableId)
    const destColIndex = newColumns.findIndex(c => c.id === destination.droppableId)
    const [movedTask] = newColumns[sourceColIndex].tasks.splice(source.index, 1)
    newColumns[destColIndex].tasks.splice(destination.index, 0, movedTask)

    setColumns(newColumns)

    // TODO: Send update to backend / socket
    // api.post(`/workspaces/${workspaceId}/tasks/move`, { movedTask, from: source, to: destination })
  }

  return (
    <div className="h-full overflow-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 p-2">
          {columns.map((col) => (
            <div key={col.id} className="w-72 bg-gray-50 p-2 rounded shadow flex-shrink-0">
              <h3 className="font-semibold mb-2">{col.title}</h3>
              <Droppable droppableId={col.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="min-h-[100px]"
                  >
                    {col.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(prov) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className="p-2 mb-2 bg-white rounded shadow cursor-move"
                          >
                            {task.title}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
