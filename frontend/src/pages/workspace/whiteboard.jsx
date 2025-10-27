import React, { useEffect, useRef, useState } from 'react'
import { Stage, Layer, Line } from 'react-konva'
import { socket } from '../../lib/socket'

export default function WhiteboardPanel({ workspaceId }) {
  const [lines, setLines] = useState([])
  const isDrawing = useRef(false)
  const stageRef = useRef(null)

  useEffect(() => {
    if (!workspaceId) return

    // Join workspace room
    socket.emit('joinWorkspace', { workspaceId })

    // Listen for remote lines
    socket.on('whiteboardLine', (line) => {
      setLines((prev) => [...prev, line])
    })

    return () => {
      socket.off('whiteboardLine')
      socket.emit('leaveWorkspace', { workspaceId })
    }
  }, [workspaceId])

  const handleMouseDown = (e) => {
    isDrawing.current = true
    const pos = e.target.getStage().getPointerPosition()
    setLines((prev) => [...prev, { points: [pos.x, pos.y], stroke: 'black', strokeWidth: 2 }])
  }

  const handleMouseMove = (e) => {
    if (!isDrawing.current) return
    const stage = e.target.getStage()
    const point = stage.getPointerPosition()
    setLines((prev) => {
      const lastLine = prev[prev.length - 1]
      lastLine.points = lastLine.points.concat([point.x, point.y])
      return [...prev.slice(0, -1), lastLine]
    })
  }

  const handleMouseUp = () => {
    isDrawing.current = false
    // Send last line to server
    const lastLine = lines[lines.length - 1]
    if (lastLine) {
      socket.emit('whiteboardLine', { workspaceId, line: lastLine })
    }
  }

  const clearBoard = () => {
    setLines([])
    socket.emit('whiteboardClear', { workspaceId })
  }

  useEffect(() => {
    // Listen for clear events
    socket.on('whiteboardClear', () => setLines([]))
    return () => socket.off('whiteboardClear')
  }, [])

  return (
    <div className="flex flex-col h-full">
      <div className="flex gap-2 mb-2">
        <button
          onClick={clearBoard}
          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Clear
        </button>
      </div>
      <div className="flex-1 border rounded bg-white">
        <Stage
          width={window.innerWidth - 300} // adjust according to sidebar width
          height={window.innerHeight - 150}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          ref={stageRef}
          className="cursor-crosshair"
        >
          <Layer>
            {lines.map((line, i) => (
              <Line
                key={i}
                points={line.points}
                stroke={line.stroke}
                strokeWidth={line.strokeWidth}
                tension={0.5}
                lineCap="round"
                lineJoin="round"
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  )
}
