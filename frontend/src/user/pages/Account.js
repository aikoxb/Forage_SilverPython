import React, { useEffect, useState, useContext } from "react";
import { useHttpClient } from "../../shared/hooks/http-hooks";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import SuccessModal from "../../shared/components/UIElements/SuccessModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import { VALIDATOR_REQUIRE, VALIDATOR_EMAIL } from "../../shared/util/validator";
import { useForm } from "../../shared/hooks/form-hooks";
import "./Account.css";

const Account = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const [loadedUser, setLoadedUser] = useState();
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const [formState, inputHandler, setFormData] = useForm(
        {
            name: { value: "", isValid: false },
            email: { value: "", isValid: false },
            phone: { value: "", isValid: false },
            address: { value: "", isValid: false },
        },
        false
    );

    //get user details
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:8080/api/users/${auth.userId}`
                );
                setLoadedUser(responseData.user);
                setFormData(
                    {
                        name: { value: responseData.user.name, isValid: true },
                        email: { value: responseData.user.email, isValid: true },
                        phone: { value: responseData.user.phone, isValid: true },
                        address: { value: responseData.user.address, isValid: true },
                    },
                    true
                );
            } catch (err) {}
        };
        fetchUser();
    }, [sendRequest, auth.userId, setFormData]);

    const updateSubmitHandler = async (event) => {
        event.preventDefault();
        try {
            const updatedData = {
                name: formState.inputs.name.value,
                email: formState.inputs.email.value,
                phone: formState.inputs.phone.value,
                address: formState.inputs.address.value,
            };

            await sendRequest(
                `http://localhost:8080/api/users/users/${auth.userId}`,
                "PATCH",
                JSON.stringify(updatedData),
                {
                    "Content-Type": "application/json", 
                    Authorization: "Bearer " + auth.token,
                }
            );
            setShowSuccessModal(true);
            setLoadedUser((prevUser) => ({ ...prevUser, ...updatedData }));
        } catch (err) {}
    };

    const clearSuccessModal = () => {
        setShowSuccessModal(false); // Close success modal
    };

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && <LoadingSpinner asOverlay />}
            {!isLoading && loadedUser && (
                <form className="account-form" onSubmit={updateSubmitHandler}>
                    <Input
                        id="name"
                        element="input"
                        type="text"
                        label="Name"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a name."
                        onInput={inputHandler}
                        initialValue={loadedUser.name}
                        initialValid={true}
                    />
                    <Input
                        id="email"
                        element="input"
                        type="email"
                        label="Email"
                        validators={[VALIDATOR_EMAIL()]}
                        errorText="Please enter a valid email."
                        onInput={inputHandler}
                        initialValue={loadedUser.email}
                        initialValid={true}
                    />
                    <Input
                        id="phone"
                        element="input"
                        type="text"
                        label="Phone"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter a phone number."
                        onInput={inputHandler}
                        initialValue={loadedUser.phone}
                        initialValid={true}
                    />
                    <Input
                        id="address"
                        element="textarea"
                        label="Address"
                        validators={[VALIDATOR_REQUIRE()]}
                        errorText="Please enter an address."
                        onInput={inputHandler}
                        initialValue={loadedUser.address}
                        initialValid={true}
                    />
                    <Button type="submit" disabled={!formState.isValid}>
                        UPDATE ACCOUNT
                    </Button>
                </form>
            )}
            {showSuccessModal && (
                <SuccessModal
                    message="Account updated successfully!"
                    onClear={clearSuccessModal}
                    show={showSuccessModal} 
                />
            )}
        </React.Fragment>
    );
};

export default Account;
