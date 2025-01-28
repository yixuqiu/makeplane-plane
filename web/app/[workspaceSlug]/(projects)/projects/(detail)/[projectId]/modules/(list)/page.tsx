"use client";

import { useCallback } from "react";
import { observer } from "mobx-react";
import { useParams } from "next/navigation";
// types
import { TModuleFilters } from "@plane/types";
// components
import { PageHead } from "@/components/core";
import { EmptyState } from "@/components/empty-state";
import { ModuleAppliedFiltersList, ModulesListView } from "@/components/modules";
// constants
import { EmptyStateType } from "@/constants/empty-state";
// helpers
import { calculateTotalFilters } from "@/helpers/filter.helper";
// hooks
import { useModuleFilter, useProject } from "@/hooks/store";

const ProjectModulesPage = observer(() => {
  const { workspaceSlug, projectId } = useParams();
  // store
  const { getProjectById, currentProjectDetails } = useProject();
  const { currentProjectFilters, currentProjectDisplayFilters, clearAllFilters, updateFilters, updateDisplayFilters } =
    useModuleFilter();
  // derived values
  const project = projectId ? getProjectById(projectId.toString()) : undefined;
  const pageTitle = project?.name ? `${project?.name} - Modules` : undefined;

  const handleRemoveFilter = useCallback(
    (key: keyof TModuleFilters, value: string | null) => {
      if (!projectId) return;
      let newValues = currentProjectFilters?.[key] ?? [];

      if (!value) newValues = [];
      else newValues = newValues.filter((val) => val !== value);

      updateFilters(projectId.toString(), { [key]: newValues });
    },
    [currentProjectFilters, projectId, updateFilters]
  );

  if (!workspaceSlug || !projectId) return <></>;

  // No access to
  if (currentProjectDetails?.module_view === false)
    return (
      <div className="flex items-center justify-center h-full w-full">
        <EmptyState
          type={EmptyStateType.DISABLED_PROJECT_MODULE}
          primaryButtonLink={`/${workspaceSlug}/projects/${projectId}/settings/features`}
        />
      </div>
    );

  return (
    <>
      <PageHead title={pageTitle} />
      <div className="h-full w-full flex flex-col">
        {(calculateTotalFilters(currentProjectFilters ?? {}) !== 0 || currentProjectDisplayFilters?.favorites) && (
          <ModuleAppliedFiltersList
            appliedFilters={currentProjectFilters ?? {}}
            isFavoriteFilterApplied={currentProjectDisplayFilters?.favorites ?? false}
            handleClearAllFilters={() => clearAllFilters(`${projectId}`)}
            handleRemoveFilter={handleRemoveFilter}
            handleDisplayFiltersUpdate={(val) => {
              if (!projectId) return;
              updateDisplayFilters(projectId.toString(), val);
            }}
            alwaysAllowEditing
          />
        )}
        <ModulesListView />
      </div>
    </>
  );
});

export default ProjectModulesPage;
