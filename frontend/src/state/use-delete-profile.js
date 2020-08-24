import { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import useAuth from "../hooks/use-auth";

export const APPLY_DELETE_PROFILE_REQUEST = gql`
  mutation($message: String!) {
    insert_users_delete_requests(objects: { message: $message }) {
      affected_rows
    }
  }
`;

const useDeleteProfile = () => {
  const [message, setMessage] = useState("");
  const { logout } = useAuth();
  const [performDelete, { loading, error }] = useMutation(
    APPLY_DELETE_PROFILE_REQUEST
  );

  const submit = () => {
    if (!message.length) {
      alert("Please give me a reason why do you want to leave!");
      return;
    }

    performDelete({ variables: { message } }).then(() => logout());
  };

  return {
    message,
    setMessage,
    submit,
    loading,
    error
  };
};

export default useDeleteProfile;
