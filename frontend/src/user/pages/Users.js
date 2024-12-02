import React, { useEffect, useState } from "react";

import UserList from "../components/UsersList"; 
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import Card from "../../shared/components/UIElements/Card";

const Users = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:8080/api/users" 
        );

        setLoadedUsers(responseData.users);
      } catch (err) {}
    };

    fetchUsers();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && loadedUsers.length > 0 ? (
        <UserList items={loadedUsers} />
      ) : (
        <div className="center">
          <Card>
            <h2>No users found.</h2>
          </Card>
        </div>
      )}
    </React.Fragment>
  );
};

export default Users;