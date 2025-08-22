import { useState, useContext, useEffect } from "react";
import { storeContext } from "../context/storeContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Spinner from "../layout/Spinner";

function Dashboard() {
  const [editMode, setEditMode] = useState(false);
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState(null);
  const [showForm, setShowForm] = useState(true);

  const {
    token,
    apiUrl,
    isLoading,
    setIsLoading,
    fetchProjects,
    projects,
    fetchProfile,
    fullName,
    isAdmin
  } = useContext(storeContext);

  useEffect(() => {
    fetchProjects();
    fetchProfile();
    if (isAdmin) {
      setShowForm(false);
    }
  }, [isAdmin]);

  if (isLoading) {
    return <Spinner />;
  }

  function clearForm() {
    setDescription("");
    setPrice("");
    setProjectStatus("");
    setTitle("");
  }

  async function updateProjectHandler() {
    setIsLoading(true);
     if (projectStatus === "") {
       toast.error("Please select a status");
       return;
     }
    try {
      const response = await fetch(`${apiUrl}/project/update/${projectId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: projectStatus,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error("Unable to update a project, try again later");
        setIsLoading(false);
        console.log(data);
        return;
      }

      toast.success(data.message);
      fetchProjects(); // update the book list
      clearForm();
      setIsLoading(false);
      return;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  async function submitProjectHandler() {
    console.log(description, price, projectStatus, title);
   
    setIsLoading(true);
    console.log(token);
    try {
      const response = await fetch(`${apiUrl}/project/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: title,
          description: description,
          price: Number(price),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error("Unable to add a product, try again later");
        setIsLoading(false);
        console.log(data);
        return;
      }

      toast.success(data.message);
      fetchProjects(); // update the book list
      clearForm();
      setIsLoading(false);
      return;
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto mt-20">
      <h1 className="text-3xl font-bold">
        Welcome {fullName} to your Dashboard
      </h1>
      {showForm && (
        <form
          className="bg-white shadow-md mt-14 rounded px-8 pt-6 pb-8 mb-4 mx-auto w-1/2"
          onSubmit={(e) => {
            e.preventDefault();
            editMode ? updateProjectHandler() : submitProjectHandler();
          }}
        >
          <h2 className="text-2xl font-bold mb-4">
            {editMode ? "Update" : "Add"} Project
          </h2>
          {!editMode && !isAdmin && (
            <>
              {" "}
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="title"
                >
                  Title
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="title"
                  type="text"
                  placeholder="Enter title"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="price"
                >
                  Price
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="price"
                  type="number"
                  placeholder="Enter price"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="description"
                  placeholder="Enter description"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
            </>
          )}

          {editMode && isAdmin && (
            <>
              <div>
                <p className="block text-gray-700 text-sm font-semibold mb-2">
                  Title : {title}
                </p>
              </div>
              <div>
                <p className="block text-gray-700 text-sm font-semibold mb-2">
                  Description : {description}
                </p>
              </div>
              <div>
                <p className="block text-gray-700 text-sm font-semibold mb-2">
                  PRICE : ₦{Number(price).toLocaleString()} NGN
                </p>
              </div>
              <div>
                <p className="block text-gray-700 text-sm font-semibold mb-2">
                  Current status : {projectStatus}
                </p>
              </div>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="category"
                >
                  Choose to update project Status
                </label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="category"
                  required
                  onChange={(e) => setProjectStatus(e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="DRAFT">Draft</option>
                  <option value="IN_REVIEW">In Review</option>
                  <option value="APPROVED">Approved</option>
                </select>
              </div>
            </>
          )}

          <div className="flex items-center justify-between">
            <button
              className={
                editMode
                  ? "text-black border bg-white hover:bg-white focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2"
                  : "bg-black hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              }
              type="submit"
            >
              {editMode && isAdmin && "Update Project"}
              {!editMode && !isAdmin && "Add Project"}
            </button>
            {editMode && (
              <button
                className="text-black border bg-white hover:bg-white focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2"
                onClick={() => {
                  setShowForm(false);
                  setEditMode(false);
                  clearForm();
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg mt-10">
        <h2 className="text-2xl font-bold mb-4"> Project List</h2>
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="py-3 px-6">
                Title
              </th>
              <th scope="col" className="py-3 px-6">
                Price
              </th>
              <th scope="col" className="py-3 px-6">
                Status
              </th>
              <th scope="col" className="py-3 px-6">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.length === 0
              ? "No projects found. please add a project"
              : projects.map((project) => {
                  return (
                    <tr
                      className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                      key={project.id}
                    >
                      <td className="py-4 px-6">{project.title}</td>
                      <td className="py-4 px-6">
                        {Number(project.price).toLocaleString()} NGN
                      </td>
                      <td className="py-4 px-6">{project.status}</td>
                      <td className="py-4 px-6">
                        <Link
                          to={`/project/${project.id}`}
                          className="text-white bg-black hover:bg-black focus:ring-4 focus:ring-black font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2"
                        >
                          View details of project to download
                        </Link>

                        {isAdmin && (
                          <button
                            onClick={() => {
                              setShowForm(true);
                              setEditMode(true);
                              setProjectId(project.id);
                              setTitle(project.title);
                              setDescription(project.description);
                              setPrice(project.price);
                              setProjectStatus(project.status);
                            }}
                            type="button"
                            className="text-black border bg-white hover:bg-white focus:ring-4 focus:ring-white font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center mr-2"
                          >
                            Update
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default Dashboard;
