import React from "react";import { useState, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
export default function ProfilePage() {
  const { authUser, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const fileInputRef = useRef(null);
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePicture: base64Image });
    };

  };

  return (
    <div className="w-full max-w-3xl bg-white backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-white/40">
      {/* Header */}
      <div className="h-40 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 "></div>

      {/* Avatar */}
      <div className="flex flex-col items-center -mt-16 px-8">
        <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200">
          <button
            className="rounded-full overflow-hidden relative group"
            onClick={() => fileInputRef.current.click()}
          >
            <img
              src={selectedImg||authUser.profilePicture || "/avatar.png"}
              alt="User image"
              className={`size-full object-${selectedImg ? 'cover' : 'contain'}`}
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <span className="text-white text-xs">Change</span>
            </div>
          </button>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageUpload}
            className="hidden"
          />
        </div>

        <h2 className="text-2xl font-semibold mt-4 text-gray-800">
          {authUser.fullName}
        </h2>

        <p className="text-gray-500 text-sm">{authUser.email}</p>

        <p className="text-indigo-500 text-sm font-medium mt-1">
          @{authUser.username}
        </p>
      </div>

      {/* Stats */}
      <div className="flex justify-center gap-6 mt-6 px-6">
        <div className="bg-slate-100 px-6 py-3 rounded-xl text-center">
          <p className="text-xl font-semibold">10</p>
          <p className="text-xs text-gray-500">Contacts</p>
        </div>

        <div className="bg-slate-100 px-6 py-3 rounded-xl text-center">
          <p className="text-xl font-semibold">5</p>
          <p className="text-xs text-gray-500">Groups</p>
        </div>

        <div className="bg-slate-100 px-6 py-3 rounded-xl text-center">
          <p className="text-xl font-semibold">12</p>
          <p className="text-xs text-gray-500">Chats</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t mt-6"></div>

      {/* Form */}
      <div className="p-8 grid md:grid-cols-2 gap-6">
        <div>
          <label className="text-sm text-gray-500">Full Name</label>
          <input
            type="text"
            defaultValue={authUser.fullName}
            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Username</label>
          <input
            type="text"
            defaultValue={authUser.username}
            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>

        <div>
          <label className="text-sm text-gray-500">Email</label>
          <input
            type="email"
            defaultValue={authUser.email}
            className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 px-8 pb-8">
        <button className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition">
          Cancel
        </button>

        <button className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-md">
          Save Changes
        </button>
      </div>
    </div>
  );
}
