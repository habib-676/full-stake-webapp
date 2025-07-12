// import React, { useEffect, useState } from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
import { useQuery } from "@tanstack/react-query";

const useRole = () => {
  const { user, loading } = useAuth();
  const axiosSecure = useAxiosSecure();
  // const [role, setRole] = useState(null);
  // const [isRoleLoading, setIsRoleLoading] = useState(true);

  // handle using tanstack query :
  const { data: role, isLoading: isRoleLoading } = useQuery({
    queryKey: ["role", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await axiosSecure(`/users/role/${user?.email}`);
      return data;
    },
  });

  // handling manually
  // useEffect(() => {
  //   const fetchUserRole = async () => {
  //     try {
  //       if (!user) return setIsRoleLoading(false);

  //       const { data } = await axiosSecure(
  //         `${import.meta.env.VITE_API_URL}/users/role/${user?.email}`
  //       );
  //       setRole(data.role);
  //     } catch (error) {
  //       console.log(error);
  //     } finally {
  //       setIsRoleLoading(false);
  //     }
  //   };
  //   fetchUserRole();
  // }, [user, axiosSecure]);

  console.log(role);
  return [role.role, isRoleLoading];
};

export default useRole;
