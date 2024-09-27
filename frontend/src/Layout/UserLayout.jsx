import { Outlet } from "react-router-dom";

import React from 'react'
import { UserHeaderComponent } from "@/components/user-header";
import { UserFooterComponent } from "@/components/user-footer";

const UserLayout = () => {
  return (
    <>
    <UserHeaderComponent/>
    <Outlet/>
    <UserFooterComponent/>
    </>
  )
}

export default UserLayout
