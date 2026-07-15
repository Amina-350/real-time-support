import { BrowserRouter, Routes, Route } from "react-router-dom";

import AgentDashboard from "./components/CustomerSupportDashboard/AgentDashboard/AgentDashboard";
import AdminDashboard from "./components/AdminWorkDashboard/AdminDashboard/AdminDashboard";
import Header from "./components/ClientDashboard/Header/Header";
import Clientmain from "./components/ClientDashboard/Dashboard/Clientmain";
import CreateNewTicket from "./components/ClientDashboard/Sidebar/CreateNewTicket";
import Register from "./components/Authentication/Register";
import Login from "./components/Authentication/Login";
import Allusers from "./components/AdminWorkDashboard/Allusers";
import UserDetailPage from "./components/AdminWorkDashboard/UserDetailPage";
import TicketDetailPage from "./components/CustomerSupportDashboard/CustomerCard/TicketDetailPage";
import ChatWindow from "./components/RealTimeChat/ChatWindow";
import CustomerChatList from "./components/ClientDashboard/CustomerChatList";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/clientdashboard" element={<Clientmain />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} />
        <Route path="/chat-window/:id/:reciverId" element={<ChatWindow />} />
        <Route path="/agentdashboard" element={<AgentDashboard />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/create-new-ticket" element={<CreateNewTicket />} />
        <Route path="/all-users" element={<Allusers />} />
        <Route path="/user-detail-page/:id" element={<UserDetailPage />} />
         <Route path="/customer-chat" element={<CustomerChatList />} />
        <Route path="/ticket/singleticket/:id" element={<TicketDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
