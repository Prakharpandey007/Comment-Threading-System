# 📝 Comment Threading System

A simple in-memory **Comment Threading System** built with **Node.js + Express**.  
It supports:
- Adding comments to posts
- Nested replies up to 5 levels deep
- Two comment views:
  - **Tree view**: Nested replies
  - **Flat view**: All comments in a list
- Optional features:
  - Auto-collapse long reply chains
  - Upvote/Downvote system

⚡ All data is stored **in-memory** using JavaScript `Map` and `Set`.  
No database is used — all data resets when the server restarts (by design).

---

## 📌 Problem Statement

The task was to implement a **comment threading system** that:
1. Allows adding comments to posts.
2. Supports replies up to depth 5.
3. Provides both **tree view** and **flat view** of comments.
4. Optionally supports:
   - Collapsing threads with too many replies.
   - Comment voting (+1 for upvote / -1 for downvote).

---

🎥 Loom Video:-
Check out [Loom Video](https://www.loom.com/share/02777bd1db3f4400ba99388485225952?sid=614657d1-1752-4387-9c6e-e87b19a71da5)

---

## 🛠️ Approach & Methodology

- Used **Maps and Sets** to store posts and comments efficiently.
- For each post, we maintain:
  - `commentsByPost`: Map of all comments for that post.
  - `headComment`: Set of root comments (no parent).
  - `subComments`: Mapping of parent → child comment IDs.
- When adding a comment:
  - If it’s a reply, we check parent’s depth and enforce max depth = 5.
- For views:
  - **Tree View** recursively builds the comment tree.
  - **Flat View** sorts all comments by timestamp.
- Added support for:
  - **Collapse**: If replies exceed a threshold, only show the first N.
  - **Voting**: Users can upvote (+1) or downvote (-1).

---

## 📂 Folder Structure

```
comment-threading-system/
├── src/
│ ├── routes/
│ │ ├── posts.routes.js # Post-related routes
│ │ └── comments.routes.js # Comment-related routes
│ ├── services/
│ │ └── comments.service.js # Business logic for comments
│ ├── store/
│ │ └── memoryStore.js # In-memory data store
│ ├── middleware/
│ │ └── errorHandler.js # Centralized error handler
│ └── server.js # Express app + server
│
├── package.json
└── README.md
```


---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

---

## 🚀 Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/Prakharpandey007/Comment-Threading-System.git
   cd comment-threading-system
2. Install dependencies
   ```bash
    npm install
3. Run the server
   ```bash
   npm start
---

## Complex Logic Explained
1. Depth Enforcement
- Each comment stores its depth.
- Before adding a reply, we check parent.depth + 1.
- If depth > 5, reject with error.

2.Tree Building
- Each post maintains a mapping: parentId -> Set(childIds).
- Tree view is built recursively by traversing these sets.

3. Auto-collapse
- If a comment has more replies than a threshold, only the first N are shown.
- A meta object is attached showing hidden_count.

4.Voting

- Each comment has a votes field.
- A vote request increments/decrements this counter.
  
---

## ⚠️ Areas of Special Consideration

- No Database: All data resets on server restart.
- Thread Depth: Replies beyond depth 5 are rejected.
- Concurrent Access: Since data is in-memory, this won’t scale across multiple server instances without external storage.
- Voting Security: No authentication is implemented; any user can vote multiple times (not production-safe).
