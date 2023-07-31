import React from "react";

// contexts
import { ProfileIssuesContextProvider } from "contexts/profile-issues-context";
import { ProfileAuthWrapper } from "layouts/profile-layout";
// components
import { ProfileIssuesView } from "components/profile";
// types
import type { NextPage } from "next";

const ProfileAssignedIssues: NextPage = () => (
  <ProfileIssuesContextProvider>
    <ProfileAuthWrapper>
      <ProfileIssuesView />
    </ProfileAuthWrapper>
  </ProfileIssuesContextProvider>
);

export default ProfileAssignedIssues;
