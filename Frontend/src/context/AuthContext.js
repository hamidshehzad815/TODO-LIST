import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserRole = async () => {
      try {
        const response = await fetch("http://localhost:8000/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setUserRole(data.role); // Ensure profile API returns role
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      }
    };

    if (token) {
      fetchUserRole();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userRole, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};
