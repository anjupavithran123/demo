import React, { useEffect, useRef, useState } from 'react'
import { socket } from '../../lib/socket'
import SimplePeer from 'simple-peer'

export default function VideoPanel({ workspaceId }) {
  const [peers, setPeers] = useState([])
  const localVideoRef = useRef()
  const peersRef = useRef([])

  useEffect(() => {
    if (!workspaceId) return

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      localVideoRef.current.srcObject = stream

      socket.emit('joinWorkspace', { workspaceId })

      socket.on('allUsers', (users) => {
        const peers = []
        users.forEach(userID => {
          const peer = createPeer(userID, socket.id, stream)
          peersRef.current.push({ peerID: userID, peer })
          peers.push({ peerID: userID, peer })
        })
        setPeers(peers)
      })

      socket.on('userJoined', (payload) => {
        const peer = addPeer(payload.signal, payload.callerID, stream)
        peersRef.current.push({ peerID: payload.callerID, peer })
        setPeers(users => [...users, { peerID: payload.callerID, peer }])
      })

      socket.on('receivingReturnedSignal', (payload) => {
        const item = peersRef.current.find(p => p.peerID === payload.id)
        item.peer.signal(payload.signal)
      })
    })

    return () => {
      socket.emit('leaveWorkspace', { workspaceId })
      socket.off('allUsers')
      socket.off('userJoined')
      socket.off('receivingReturnedSignal')
    }
  }, [workspaceId])

  function createPeer(userToSignal, callerID, stream) {
    const peer = new SimplePeer({
      initiator: true,
      trickle: false,
      stream,
    })

    peer.on('signal', signal => {
      socket.emit('sendingSignal', { userToSignal, callerID, signal })
    })

    return peer
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new SimplePeer({
      initiator: false,
      trickle: false,
      stream,
    })

    peer.on('signal', signal => {
      socket.emit('returningSignal', { signal, callerID })
    })

    peer.signal(incomingSignal)
    return peer
  }

  return (
    <div className="flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-2">Video Call</h2>
      <div className="flex flex-wrap gap-2">
        <video ref={localVideoRef} autoPlay muted playsInline className="w-64 h-48 bg-black rounded" />
        {peers.map(peerObj => (
          <Video key={peerObj.peerID} peer={peerObj.peer} />
        ))}
      </div>
    </div>
  )
}

// Component to display remote peer video
function Video({ peer }) {
  const ref = useRef()

  useEffect(() => {
    peer.on('stream', stream => {
      ref.current.srcObject = stream
    })
  }, [peer])

  return <video ref={ref} autoPlay playsInline className="w-64 h-48 bg-black rounded" />
}
