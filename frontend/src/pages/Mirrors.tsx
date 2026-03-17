import { useState } from 'react';
import { WidgetSidebar } from '../components/layout/dashboard/WidgetSidebar';
import { EditModeToggle } from '../components/layout/editMode/EditModeToggle';
import { EditModeProvider, useEditModeContext } from '../context/EditModeContext';
import { MirrorSubNav } from '../components/layout/navigation/sub-navigation/MirrorSubNav';
import { CreateMirrorModal } from '../components/mirrors/CreateMirrorModal';
import { useGetMyMirrorsQuery } from '../api/endpoints/mirror';
import { MirrorCanvas } from '../components/mirrors/MirrorCanvas';
import type { WidgetType } from '../components/layout/dashboard/widgetSidebar/types.ts';

function MirrorContent() {
  const { isEditMode } = useEditModeContext();
  const [activeMirrorId, setActiveMirrorId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [widgetsByMirrorId, setWidgetsByMirrorId] = useState<Record<string, WidgetType[]>>({});
  const { data: mirrors = [] } = useGetMyMirrorsQuery();

  const activeMirror = mirrors.find((m) => m.id === activeMirrorId) ?? null;
  const activeWidgets = activeMirrorId ? widgetsByMirrorId[activeMirrorId] ?? [] : [];

  const handleAddWidget = (widget: WidgetType) => {
    if (!activeMirrorId) return;

    setWidgetsByMirrorId((prev) => {
      const current = prev[activeMirrorId] ?? [];

      if (current.includes(widget)) {
        return prev;
      }

      return {
        ...prev,
        [activeMirrorId]: [...current, widget],
      };
    });
  };

  const handleRemoveWidget = (widget: WidgetType) => {
    if (!activeMirrorId) return;
    setWidgetsByMirrorId((prev) => ({
      ...prev,
      [activeMirrorId]: (prev[activeMirrorId] ?? []).filter((w) => w !== widget),
    }));
  };

  return (
    <div className="flex flex-col flex-1">
      <MirrorSubNav
        activeMirrorId={activeMirrorId}
        onSelectMirror={setActiveMirrorId}
        onAddMirror={() => setShowCreateModal(true)}
      />

      {showCreateModal && <CreateMirrorModal onClose={() => setShowCreateModal(false)} />}

      <div className="flex flex-1 overflow-hidden">
        {isEditMode && (
          <WidgetSidebar onAddWidget={handleAddWidget} canAddWidget={Boolean(activeMirrorId)} />
        )}
        <MirrorCanvas mirror={activeMirror} widgets={activeWidgets} onRemoveWidget={handleRemoveWidget} />
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
