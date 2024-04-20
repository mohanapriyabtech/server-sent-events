## Server-Sent Events (SSE) Overview

### Description

Server-Sent Events (SSE) is a technology that enables a server to push real-time updates to a client over a single HTTP connection.
This README provides an overview of SSE, including how it works, key features, and use cases.

### How SSE Works

1. **Connection Establishment:**
    - The client initiates an HTTP request to the server using the `EventSource` API.
    - Server responds with an SSE stream with `Content-Type: text/event-stream`.

2. **Data Transmission:**
    - Server continuously sends data as SSE events with fields like `data`, `event`, `id`, and `retry`.
    - Client handles incoming events using the `EventSource` API.

3. **Keep-Alive Connection:** SSE maintains a persistent connection for real-time communication.

### Key Features

- **One-Way Communication:** Server can send updates to the client without client requests.
- **Text-Based Data:** Supports structured data transmission (e.g., JSON, plain text).
- **Automatic Reconnection:** Built-in reconnection for interrupted connections.
- **Event Stream Format:** Follows a specific format for organizing and parsing events.

### Use Cases

- **Real-Time Notifications:** Notify clients about updates without polling.
- **Live Feeds and Dashboards:** Stream live data to clients in real time.
- **Chat Applications:** Implement real-time chat functionality.
- **Live Sports Updates:** Provide live scores and commentary to sports fans.

### Getting Started

To use SSE in your application:
1. Ensure server-side support for SSE.
2. Use the `EventSource` API on the client side to handle SSE events.