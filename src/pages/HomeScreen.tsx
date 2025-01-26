import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {AppDispatch, RootState} from "../redux/store.ts";
import {blockUsers, deleteUsers, fetchUsers, unblockUsers} from "../redux/usersSlice.ts";
import {logout, updateUserStatus} from "../redux/authSlice.ts";
import {showErrorToast, showSuccessToast} from "../utils/toast.ts";
import {strings} from "../utils/strings.ts";


const HomeScreen: React.FC = () => {
  const [filter, setFilter] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [sortByEmail, setSortByEmail] = useState<"asc" | "desc">("asc");

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { users, isLoading, error } = useSelector(
    (state: RootState) => state.users
  );
  const { user: currentUser } = useSelector((state: RootState) => state.auth);
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUsers());
    }
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (
      currentUser &&
      (currentUser.status === "blocked" || currentUser.status === "deleted")
    ) {
      dispatch(logout());
      navigate("/login");
    }
  }, [currentUser, navigate, dispatch]);

  const filteredData = Array.isArray(users)
    ? users.filter((user) =>
        user.name.toLowerCase().includes(filter.toLowerCase())
      )
    : [];

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortByEmail === "asc") {
      return a.email.localeCompare(b.email);
    } else {
      return b.email.localeCompare(a.email);
    }
  });

  const handleCheckboxChange = (userId: string) => {
    const newSelectedUsers = new Set(selectedUsers);
    if (newSelectedUsers.has(userId)) {
      newSelectedUsers.delete(userId);
    } else {
      newSelectedUsers.add(userId);
    }
    setSelectedUsers(newSelectedUsers);
  };

  const handleSelectAll = () => {
    if (selectedUsers.size === sortedData.length) {
      setSelectedUsers(new Set());
    } else {
      const allUserIds = sortedData.map((user) => user.id);
      setSelectedUsers(new Set(allUserIds));
    }
  };

  const checkCurrentUser = async () => {
    if (!currentUser?.email) {
      dispatch(logout());
      navigate("/login");
      return false;
    }

    try {
      const response = await fetch(
        "https://management-server-bmj0.onrender.com/api/users/check-current-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser.token}`,
          },
          body: JSON.stringify({ email: currentUser.email }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to check current user");
      }

      const data = await response.json();
      if (data.user.status === "blocked" || data.user.status === "deleted") {
        dispatch(logout());
        navigate("/login");
        return false;
      }

      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      dispatch(logout());
      navigate("/login");
      return false;
    }
  };

  const handleBlock = async () => {
    if (selectedUsers.size === 0) {
      showErrorToast("No users selected!");
      return;
    }

    const isUserValid = await checkCurrentUser();
    if (!isUserValid) return;

    try {
      const result = await dispatch(
        blockUsers(Array.from(selectedUsers))
      ).unwrap();

      if (result.success) {
        showSuccessToast(
          `Blocked users with IDs: ${result.userIds.join(", ")}`
        );
        setSelectedUsers(new Set());

        if (result.userIds.includes(currentUser?.id)) {
          dispatch(logout());
          navigate("/login");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast("Failed to block users");
    }
  };

  const handleUnblock = async () => {
    if (selectedUsers.size === 0) {
      showErrorToast("No users selected!");
      return;
    }

    const isUserValid = await checkCurrentUser();
    if (!isUserValid) return;

    try {
      const result = await dispatch(
        unblockUsers(Array.from(selectedUsers))
      ).unwrap();

      if (result.success) {
        showSuccessToast(
          `Unblocked users with IDs: ${result.userIds.join(", ")}`
        );
        setSelectedUsers(new Set());

        if (result.userIds.includes(currentUser?.id)) {
          dispatch(updateUserStatus({ status: "active" }));
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast("Failed to unblock users");
    }
  };

  const handleDelete = async () => {
    if (selectedUsers.size === 0) {
      showErrorToast("No users selected!");
      return;
    }

    const isUserValid = await checkCurrentUser();
    if (!isUserValid) return;

    try {
      const result = await dispatch(
        deleteUsers(Array.from(selectedUsers))
      ).unwrap();

      if (result.success) {
        showSuccessToast(
          `Deleted users with IDs: ${result.userIds.join(", ")}`
        );
        setSelectedUsers(new Set());

        if (result.userIds.includes(currentUser?.id)) {
          dispatch(logout());
          navigate("/login");
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      showErrorToast("Failed to delete users");
    }
  };

  const handleSortByEmail = () => {
    setSortByEmail(sortByEmail === "asc" ? "desc" : "asc");
  };

  if (isLoading) {
    return <div className='text-center mt-5'>Loading...</div>;
  }

  if (error) {
    return <div className='text-center mt-5 text-danger'>{error}</div>;
  }

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Header />
      <div className='container mt-4 flex-grow-1'>
        <h2>{strings.home.title}</h2>
        <div className='bg-light p-3 mb-3 rounded shadow-sm'>
          <div className='d-flex justify-content-between'>
            <div>
              <button
                className='btn btn-outline-primary me-2'
                onClick={handleBlock}
              >
                {strings.home.blockButton}
              </button>
              <button
                className='btn btn-outline-primary me-2'
                onClick={handleUnblock}
              >
                {strings.home.unblockButton}
              </button>
              <button className='btn btn-outline-danger' onClick={handleDelete}>
                {strings.home.deleteButton}
              </button>
            </div>
            <div>
              <input
                type='text'
                className='form-control'
                placeholder={strings.home.filterPlaceholder}
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        <table className='table table-hover table-borderless shadow-sm'>
          <thead className='table-primary'>
            <tr>
              <th style={{ textAlign: "center", verticalAlign: "middle" }}>
                <input
                  type='checkbox'
                  checked={
                    selectedUsers.size === sortedData.length &&
                    sortedData.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>{strings.home.tableHeaders.name}</th>
              <th onClick={handleSortByEmail} style={{ cursor: "pointer" }}>
                {strings.home.tableHeaders.email}{" "}
                {sortByEmail === "asc" ? "↑" : "↓"}
              </th>
              <th>{strings.home.tableHeaders.lastSeen}</th>
              <th>{strings.home.tableHeaders.role}</th>
              <th>{strings.home.tableHeaders.status}</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((user) => (
              <tr key={user.id} className='bg-white'>
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <input
                    type='checkbox'
                    checked={selectedUsers.has(user.id)}
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.last_seen).toLocaleString()}</td>
                <td>{user.role}</td>
                <td
                  style={{
                    color: user.status === "blocked" ? "red" : "green",
                    fontWeight: "bold",
                  }}
                >
                  {user.status === "blocked" ? "Blocked" : "Unblocked"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </div>
  );
};

export default HomeScreen;
