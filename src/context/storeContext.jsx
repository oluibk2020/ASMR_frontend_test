import { createContext, useState, useEffect } from "react";

export const storeContext = createContext();

export const StoreProvider = ({ children }) => {
  //define variables
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuth, setIsAuth] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");
  const [projects, setProjects] = useState([]);
  const [singleProject, setSingleProject] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const apiUrl = import.meta.env.VITE_BACKEND_URL;
  let decodedPayload = null;

  function isTokenExpired(token) {
    if (!token) return;

    try {
      const [, payload] = token.split(".");
      decodedPayload = JSON.parse(atob(payload));
      return decodedPayload.exp * 1000 < Date.now();
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    //fetch token from local storage
    const localStorageToken = localStorage.getItem("bookApp_token");
    // console.log(localStorageToken);
    const tokenExpiryStatus = isTokenExpired(localStorageToken);
    if (tokenExpiryStatus === false) {
      console.log("got here");
      setToken(localStorageToken);
      setIsAuth(true);
      if (decodedPayload.isAdmin === true) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } else {
      setIsAuth(false);
      setIsAdmin(false);
      localStorage.removeItem("bookApp_token");
    }
  }, []);

  async function fetchProfile() {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setFullName(data.profile.fullName);
      setIsLoading(false);
      return;
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProjects() {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/project/${isAdmin ? "admin/all" : "all"}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log(data);
      setProjects(data.projects);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }
  async function fetchProject(id) {
    try {
      setIsLoading(true);
      const response = await fetch(`${apiUrl}/project/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      setSingleProject(data.project);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  //exporting states/functions/data
  const contextObj = {
    isAuth,
    setIsAuth,
    setIsLoading,
    isLoading,
    apiUrl,
    password,
    setPassword,
    email,
    setEmail,
    showPassword,
    setShowPassword,
    userName,
    setUserName,
    token,
    setToken,
    fetchProjects,
    projects,
    fetchProject,
    singleProject,
    fullName,
    setFullName,
    fetchProfile,
    isAdmin,
  };

  return (
    <storeContext.Provider value={contextObj}>{children}</storeContext.Provider>
  );
};
