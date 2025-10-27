import { TabListComponent } from "components";
import React from "react";

import { TEAM_TALENT_SPHERE_TAB_CONFIG } from "app/modules/TalentSphere/Sections";

export default function TeamTalentSphere({ activeView }) {
    return (
        <div className="flex flex-col gap-4">
            <TabListComponent TAB_CONFIG={TEAM_TALENT_SPHERE_TAB_CONFIG} activeView={activeView} />
        </div>
    );
}
