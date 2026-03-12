import { useState } from 'react';
import { WidgetSidebar } from '../components/layout/dashboard/WidgetSidebar';
import { EditModeToggle } from '../components/layout/editMode/EditModeToggle';
import { EditModeProvider, useEditModeContext } from '../context/EditModeContext';
import { MirrorSubNav } from '../components/layout/navigation/sub-navigation/MirrorSubNav';
import { CreateMirrorModal } from '../components/mirrors/CreateMirrorModal';

function MirrorContent() {
  const { isEditMode } = useEditModeContext();
  const [activeMirrorId, setActiveMirrorId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="flex flex-col flex-1">
      <MirrorSubNav
        activeMirrorId={activeMirrorId}
        onSelectMirror={setActiveMirrorId}
        onAddMirror={() => setShowCreateModal(true)}
      />

      {showCreateModal && <CreateMirrorModal onClose={() => setShowCreateModal(false)} />}

      <div className="flex flex-1">
        {isEditMode && <WidgetSidebar />}
        <main
          className={`flex-1 transition-all duration-300 ${isEditMode ? 'ring-2 ring-primary ring-inset outline-dashed outline-2 -outline-offset-2 outline-primary/30' : ''}`}
        >
          {isEditMode && (
            <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 text-xs font-medium text-primary tracking-wide">
              EDIT MODE — drag widgets to arrange your layout
            </div>
          )}
        </main>
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
