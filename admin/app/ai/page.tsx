"use client";

import useSWR from "swr";
import { observer } from "mobx-react-lite";
import { Loader } from "@plane/ui";
// components
import { PageHeader } from "@/components/core";
import { InstanceAIForm } from "./components";
// hooks
import { useInstance } from "@/hooks";

const InstanceAIPage = observer(() => {
  // store
  const { fetchInstanceConfigurations, formattedConfig } = useInstance();

  useSWR("INSTANCE_CONFIGURATIONS", () => fetchInstanceConfigurations());

  return (
    <>
      <PageHeader title="Artificial Intelligence - God Mode" />
      <div className="relative container mx-auto w-full h-full p-8 py-4 space-y-6 flex flex-col">
        <div className="border-b border-custom-border-100 pb-3 space-y-1 flex-shrink-0">
          <div className="text-xl font-medium text-custom-text-100">AI features for all your workspaces</div>
          <div className="text-sm font-normal text-custom-text-300">
            Configure your AI API credentials so Plane AI features are turned on for all your workspaces.
          </div>
        </div>
        <div className="flex-grow overflow-hidden overflow-y-auto">
          {formattedConfig ? (
            <InstanceAIForm config={formattedConfig} />
          ) : (
            <Loader className="space-y-8">
              <Loader.Item height="50px" width="40%" />
              <div className="w-2/3 grid grid-cols-2 gap-x-8 gap-y-4">
                <Loader.Item height="50px" />
                <Loader.Item height="50px" />
              </div>
              <Loader.Item height="50px" width="20%" />
            </Loader>
          )}
        </div>
      </div>
    </>
  );
});

export default InstanceAIPage;
