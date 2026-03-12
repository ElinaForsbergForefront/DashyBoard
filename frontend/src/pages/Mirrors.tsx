import { useState } from 'react';
import { WidgetSidebar } from '../components/layout/dashboard/WidgetSidebar';
import { EditModeToggle } from '../components/layout/editMode/EditModeToggle';
import { EditModeProvider, useEditModeContext } from '../context/EditModeContext';
import { MirrorSubNav } from '../components/layout/navigation/sub-navigation/MirrorSubNav';
import { CreateMirrorModal } from '../components/mirrors/CreateMirrorModal';
import { useGetMyMirrorsQuery } from '../api/endpoints/mirror';
import { MirrorCanvas } from '../components/mirrors/MirrorCanvas';

function MirrorContent() {
  const { isEditMode } = useEditModeContext();
  const [activeMirrorId, setActiveMirrorId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: mirrors = [] } = useGetMyMirrorsQuery();

  const activeMirror = mirrors.find((m) => m.id === activeMirrorId) ?? null;

  return (
    <div className="flex flex-col flex-1">
      <MirrorSubNav
        activeMirrorId={activeMirrorId}
        onSelectMirror={setActiveMirrorId}
        onAddMirror={() => setShowCreateModal(true)}
      />

      {showCreateModal && <CreateMirrorModal onClose={() => setShowCreateModal(false)} />}

      <div className="flex flex-1 overflow-hidden">
        {isEditMode && <WidgetSidebar />}
        <MirrorCanvas mirror={activeMirror} />
        <EditModeToggle />
      </div>
    </div>
  );
}

export const Mirrors = () => (
  <EditModeProvider>
    <MirrorContent />
  </EditModeProvider>
);
