// src/context/UserContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

// Define the User interface including avatar and stats
interface User {
  name: string;
  avatar: string; // profile image URL
  email: string;
  nickname: string;
  bio: string;
  stats: {
    trophiesEarned: number;
    tierLevel: string;
  };
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  fetchUserProfile: () => Promise<void>;
  updateAvatar: (newAvatar: string) => void; // to update avatar in real-time
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Fetch user profile from the API and set it in context
  const fetchUserProfile = async () => {
    try {
      const response = await api.get('/account'); // Adjust the endpoint if necessary
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Function to update only the avatar in the user state
  const updateAvatar = (newAvatar: string) => {
    if (user) {
      setUser({ ...user, avatar: newAvatar });
    }
  };

  // Fetch the user profile once when the component mounts
  useEffect(() => {
    fetchUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, fetchUserProfile, updateAvatar }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
