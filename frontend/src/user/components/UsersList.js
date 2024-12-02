
import React from "react";

import "./UsersList.css";
import Card from "../../shared/components/UIElements/Card";
import UserItem from "./UserItem";

const UsersList = (props) => {
    //if no user
    if(props.items.length === 0){
        return <div className="center">
            <Card>
                <h2>No users found.</h2>
            </Card>
        </div>
    }

    //if user
    return (
        <ul className="users-list">
            {
                props.items.map((user) =>(
                    <UserItem 
                        key={user.id} 
                        id={user.id} 
                        name={user.name} 
                        orderCount={user.order}
                    />
                ))
            }
        </ul>
    )
};

export default UsersList;
