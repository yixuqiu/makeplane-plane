"use client";

import React from "react";
import { observer } from "mobx-react-lite";
// hooks
import { useInstance } from "@/hooks";
// ui
import { ToggleSwitch } from "@plane/ui";
// types
import { TInstanceAuthenticationMethodKeys } from "@plane/types";

type Props = {
  disabled: boolean;
  updateConfig: (key: TInstanceAuthenticationMethodKeys, value: string) => void;
};

export const PasswordLoginConfiguration: React.FC<Props> = observer((props) => {
  const { disabled, updateConfig } = props;
  // store
  const { formattedConfig } = useInstance();
  // derived values
  const enableEmailPassword = formattedConfig?.ENABLE_EMAIL_PASSWORD ?? "";

  return (
    <ToggleSwitch
      value={Boolean(parseInt(enableEmailPassword))}
      onChange={() => {
        Boolean(parseInt(enableEmailPassword)) === true
          ? updateConfig("ENABLE_EMAIL_PASSWORD", "0")
          : updateConfig("ENABLE_EMAIL_PASSWORD", "1");
      }}
      size="sm"
      disabled={disabled}
    />
  );
});
