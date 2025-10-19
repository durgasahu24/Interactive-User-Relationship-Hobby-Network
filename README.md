
# Interactive User Relationship Hobby Network

An **interactive web application** to visualize users, their relationships, and hobbies as a dynamic graph. Users can be added, edited, deleted, and connected by dragging one node onto another. Hobbies can be assigned and updated dynamically.

**🌐 Live Demos:**

* [Vercel Deployment](https://interactive-user-relationship-hobby.vercel.app/)
* [Render Deployment](https://interactive-user-relationship-hobby.onrender.com)

---

## 🛠️ Features

* **Dynamic Graph Rendering**: Display users and relationships interactively using **React Flow**.
* **Add/Edit/Delete Users**: Easily manage users in the network.
* **Hobby Management**: Add hobbies to users via drag-and-drop or input.
* **Connect Users**: Drag one node onto another to create relationships.
* **Popularity Score**: Nodes show popularity based on the number of relationships or hobbies.
* **Responsive Design**: Works well on both desktop and mobile.
* **Toast Notifications**: Informative messages for create, update, delete actions.
* **Custom Node Styling**: High-score and low-score nodes with different colors.
* **Bonus Feature**: Filter out AI-template coders and dynamic updates of nodes.

---



## 🧱 Tech Stack

* **Frontend**:

  * React
  * React Flow
  * Redux Toolkit
  * Tailwind CSS
  * Axios
  * Framer Motion
  * React Hot Toast

* **Backend**:

  * Node.js
  * Express
  * MongoDB

---

## 🚀 Installation & Setup

1. **Clone the repository**:

```bash
git clone https://github.com/durgasahu24/Interactive-User-Relationship-Hobby-Network.git
cd Interactive-User-Relationship-Hobby-Network
```

2. **Setup Backend**:

```bash
cd backend
npm install
npm start
```

The backend runs at `http://localhost:8000/api/v1`.

3. **Setup Frontend**:

```bash
cd frontend
npm install
npm start
```

The frontend runs at `http://localhost:3000`.

---

## 🔄 How it Works

1. **Add User**: Click "Add New User" → Fill form → Submit.
2. **Edit/Delete User**: Click on the respective button on a node.
3. **Add Hobby**: Drag a hobby onto a user node or input it in the form.
4. **Connect Users**: Drag one user node onto another to establish a relationship.
5. **Dynamic Updates**: The graph updates in real-time when users or hobbies are modified.

---

## 📂 Project Structure

```
frontend/
├─ src/
│  ├─ components/
│  │  ├─ Sidebar.jsx
│  │  ├─ Graph.jsx
│  │  ├─ UserForm.jsx
│  │  ├─ nodes/
│  │  │  ├─ HighScoreNode.jsx
│  │  │  └─ LowScoreNode.jsx
│  ├─ redux/
│  │  ├─ userSlice.js
│  │  └─ hobbiesSlice.js
│  └─ hooks/
│     └─ UseUserApi.js
backend/
├─ db.js          # database connection
├─ src/
│  ├─ models/
│  ├─ controllers/
│  ├─ routes/
│  └─ index.js

```

---

## 📦 API Endpoints

* `GET /users` → Fetch all users
* `POST /users` → Create a new user
* `PUT /users/:id` → Update a user
* `PUT /users/:id/hobby` → Add hobby to user
* `DELETE /users/:id` → Delete user
* `POST /users/:id/link` → Link user with another
* `DELETE /users/:id/unlink` → Unlink user
* `GET /hobbies` → Get all hobbies

---
