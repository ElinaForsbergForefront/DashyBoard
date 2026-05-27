import { WidgetSidebar } from '../components/layout/dashboard/WidgetSidebar';
import { EditModeToggle } from '../components/layout/editMode/EditModeToggle';
import { MirrorEditorModals } from '../components/mirrors/MirrorEditorModals';
import { MirrorSubNav } from '../components/layout/navigation/sub-navigation/MirrorSubNav';
import { EditModeProvider } from '../context/EditModeContext';
import { MirrorCanvas } from '../components/mirrors/MirrorCanvas';
import { useMirrorEditor } from '../hooks/useMirrorEditor';

function MirrorContent() {
  const {
    isEditMode,
    activeMirrorId,
    activeMirror,
    displayedMirror,
    showCreateModal,
    editingMirror,
    deletingMirror,
    pendingMirrorSwitch,
    pendingRouteLabel,
    isResolvingMirrorSwitch,
    isResolvingRouteChange,
    canAddMirror,
    isAutosaveEnabled,
    autosaveStatus,
    openCreateModal,
    closeCreateModal,
    openEditMirrorModal,
    openDeleteMirrorModal,
    closeEditMirrorModal,
    closeDeleteMirrorModal,
    handleDeleted,
    handleSelectMirror,
    handleClosePendingMirrorSwitch,
    handleDiscardAndSwitch,
    handleSaveAndSwitch,
    handleClosePendingRoute,
    handleDiscardAndNavigate,
    handleSaveAndNavigate,
    handleEnterEditMode,
    handleSave,
    handleDiscard,
    handleToggleAutosave,
    handleAddWidget,
    handleRemoveWidget,
    handleMoveWidget,
    handleUpdateWidgetConfig,
    handleWidgetEditorStateChange,
    previewMirror,
    canAddWidget,
  } = useMirrorEditor();

  return (
    <div className="flex flex-col flex-1">
      <MirrorSubNav
        activeMirrorId={activeMirrorId}
        onSelectMirror={(id) => {
          void handleSelectMirror(id);
        }}
        onAddMirror={openCreateModal}
        onEditMirror={openEditMirrorModal}
        onDeleteMirror={openDeleteMirrorModal}
        canAddMirror={canAddMirror}
      />

      <MirrorEditorModals
        showCreateModal={showCreateModal}
        editingMirror={editingMirror}
        deletingMirror={deletingMirror}
        activeMirror={activeMirror}
        pendingMirrorSwitch={pendingMirrorSwitch}
        pendingRouteLabel={pendingRouteLabel}
        isResolvingMirrorSwitch={isResolvingMirrorSwitch}
        isResolvingRouteChange={isResolvingRouteChange}
        onCloseCreateModal={closeCreateModal}
        onCloseEditModal={closeEditMirrorModal}
        onCloseDeleteModal={closeDeleteMirrorModal}
        onDeletedMirror={handleDeleted}
        onClosePendingMirrorSwitch={handleClosePendingMirrorSwitch}
        onDiscardAndSwitch={handleDiscardAndSwitch}
        onSaveAndSwitch={handleSaveAndSwitch}
        onClosePendingRoute={handleClosePendingRoute}
        onDiscardAndNavigate={handleDiscardAndNavigate}
        onSaveAndNavigate={handleSaveAndNavigate}
      />

      <div className="flex flex-1 overflow-hidden">
        {isEditMode && <WidgetSidebar onAddWidget={handleAddWidget} canAddWidget={canAddWidget} />}

        <MirrorCanvas
          mirror={displayedMirror}
          onRemoveWidget={handleRemoveWidget}
          onMoveWidget={handleMoveWidget}
          onUpdateWidgetConfig={handleUpdateWidgetConfig}
          onWidgetEditorStateChange={handleWidgetEditorStateChange}
        />

        <EditModeToggle
          disabled={!activeMirror}
          onEnterEditMode={handleEnterEditMode}
          onSave={handleSave}
          onDiscard={handleDiscard}
          onPreview={previewMirror}
          autosaveEnabled={isAutosaveEnabled}
          autosaveStatus={autosaveStatus}
          onToggleAutosave={handleToggleAutosave}
        />
      </div>
    </div>
  );
}

export const Mirrors = () => (
  <EditModeProvider>
    <MirrorContent />
  </EditModeProvider>
);
