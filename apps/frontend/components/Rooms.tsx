"use client";

import { HTTP_BACKEND } from "@/Config";
import axios from "axios";
import { useEffect, useState } from "react";
import { Plus, LogIn, Pencil } from 'lucide-react';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Room {
  id: number;
  slug: string;
}

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  console.log(HTTP_BACKEND);
  

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem("token");

    if(!tokenFromStorage){
      toast.error("Please login to continue");
      router.push("/signin");
    }
    setToken(tokenFromStorage);

    if (tokenFromStorage) {
      const fetchRooms = async () => {
        try {
          const res = await axios.get(`${HTTP_BACKEND}/room`, {
            headers: {
              authorization: tokenFromStorage,
            },
          });

          setRooms(res?.data?.rooms);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      };

      fetchRooms();
    } else {
      console.warn("No token found in localStorage");
    }
  }, [router]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [roomCode, setRoomCode] = useState('');

  const handleCreateRoom = async(e: React.FormEvent) => {
    e.preventDefault();

    try {
        const res = await axios.post(`${HTTP_BACKEND}/room`, {
            name : newRoomName
        }, {
            headers : {
                authorization: token,
            }
        })

        if(res?.data?.success){
            toast.success(res?.data?.message);
            router.push(`/canvas/${res?.data?.id}`);
        }
    } catch (error) {
        console.log(error);
        if(axios.isAxiosError(error)){
            toast.error(error?.response?.data?.message);
        }
        else{
            toast.error("Something went wrong");
        }
        
    }
    
  };
  const handleJoinRoom = async(e: React.FormEvent) => {
    e.preventDefault();
    
    try {
        const res = await axios.get(`${HTTP_BACKEND}/room/${roomCode}`,{
            headers : {
                authorization: token,
            }
        });

        if(res?.data?.success){
            router.push(`/canvas/${res?.data?.id}`);
        }
    } catch (error) {
        if(axios.isAxiosError(error)){
            toast.error(error?.response?.data?.message);
        }
        else{
            toast.error("Something went wrong");
        }
    }
  };

  const handleClickJoinRoom = (id:number)=>{
    router.push(`/canvas/${id}`)
  }
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Pencil className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">Excalidraw Clone</h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setShowJoinModal(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Join Room
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Room
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-medium text-gray-900">Name : {room.slug}</h3>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Active
                </span>
              </div>
                
              <button
                className="mt-4 w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={()=>handleClickJoinRoom(room.id)}
              >
                Join Room
              </button>
            </div>
          ))}
        </div>
      </main>

      {/* Create Room Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Create New Room</h2>
            <form onSubmit={handleCreateRoom}>
              <div className="mb-4">
                <label htmlFor="room-name" className="block text-sm font-medium text-gray-700">
                  Room Name
                </label>
                <input
                  type="text"
                  id="room-name"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 mt-2"
                  placeholder="Enter room name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Create Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Join Room Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Join Room</h2>
            <form onSubmit={handleJoinRoom}>
              <div className="mb-4">
                <label htmlFor="room-name" className="block text-sm font-medium text-gray-700">
                  Room Name
                </label>
                <input
                  type="text"
                  id="room-name"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  placeholder="Enter room name"
                  required
                />
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowJoinModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Join Room
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
