# Project Plan: Synchronized Video Streaming & Chat App

## 1. Overview
The goal is to build a real-time application that allows users to create a room by providing a video URL, invite friends, and watch the video perfectly synchronized while chatting. 

## 2. Technical Stack
*   **Frontend:** React, TypeScript, Vite
*   **Backend:** Node.js, Express
*   **Real-time Communication:** Socket.io
*   **Video Player:** `react-player` (Supports YouTube, Vimeo, Twitch, and direct media URLs)
*   **Styling:** Vanilla CSS (for maximum flexibility and a rich aesthetic)

## 3. Core Features
1.  **Room Management:**
    *   Landing page to create a room (provide a video URL) or join an existing room via Room ID.
    *   Shareable URL for easy joining.
2.  **Synchronized Video Playback:**
    *   Global state for video `URL`, `playing` status (true/false), and `playbackTime`.
    *   Actions by any user (Play, Pause, Seek) instantly propagate to all peers in the room.
3.  **Real-Time Chat:**
    *   Sidebar chat interface for users in the same room.
    *   System messages (e.g., "User joined", "User paused the video").

## 4. Architecture & Data Flow
### Backend (Socket.io)
*   **In-Memory Store:** Maintains active rooms. `rooms = { [roomId]: { url, playing, time, updatedAt, users } }`
*   **Socket Events Handled:**
    *   `join_room`: Adds user to room, returns current video state and chat history.
    *   `chat_message`: Broadcasts message to room.
    *   `video_state_update`: Receives updates (play, pause, seek) and broadcasts to all other users in the room.

### Frontend (React)
*   **Components:**
    *   `App`: Handles routing (Landing vs. Room).
    *   `Landing`: Input form for URL / Room ID.
    *   `Room`: The main viewing area containing the video and chat.
    *   `VideoPlayer`: Wraps `react-player` and binds its callbacks to Socket.io events.
    *   `ChatSidebar`: Displays messages and handles input.
*   **Synchronization Strategy:**
    *   Listen to `react-player`'s `onPlay`, `onPause`, and `onSeek` events.
    *   When an event is triggered *by the user*, emit to server.
    *   When receiving a state change *from the server*, programmatically update `react-player` (bypassing the user-triggered emit to prevent infinite loops).

## 5. Execution Steps
1.  **Backend Setup:** Initialize Node project, setup Express & Socket.io server, implement room logic.
2.  **Frontend Setup:** Initialize Vite React project, configure Socket.io client, build routing.
3.  **Video Player Implementation:** Integrate `react-player`, connect its state to Socket.io events.
4.  **Chat Implementation:** Build UI, connect to Socket.io `chat_message` events.
5.  **Polishing:** Apply rich, modern Vanilla CSS styling to make it feel alive and visually appealing.
6.  **Validation:** Test synchronization across multiple simulated clients.

Please review this plan. If approved, I will exit Plan Mode and begin implementation.