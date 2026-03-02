import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/Authcontext";
import Login from "./pages/Login";
import Feed from "./pages/Feed";
import ProtectedRoute from "./auth/ProtectedRoute";
import CreatePost from "./pages/CreatePost";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import PostDetail from "./pages/PostDetail";
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Feed />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
        </Route>

      </Routes>
    </AuthProvider>
  );
}

export default App;
