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
    <div className="flex flex-col flex-1 overflow-hidden">
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

        <div className="relative flex min-w-0 flex-1 overflow-hidden">
          {autosaveStatus !== 'idle' && (
            <div className="pointer-events-none absolute left-1/2 top-6 z-40 -translate-x-1/2 px-4">
              <div
                className={`rounded-full border px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-sm transition-all duration-300 ${
                  autosaveStatus === 'saved'
                    ? 'border-emerald-300/50 bg-emerald-500/18 text-emerald-50'
                    : autosaveStatus === 'saving'
                      ? 'border-emerald-300/40 bg-emerald-500/12 text-emerald-100'
                      : 'border-red-300/50 bg-red-500/14 text-red-100'
                }`}
                aria-live="polite"
              >
                {autosaveStatus === 'saved'
                  ? 'Autosaved'
                  : autosaveStatus === 'saving'
                    ? 'Saving changes...'
                    : 'Autosave failed'}
              </div>
            </div>
          )}

          <MirrorCanvas
            mirror={displayedMirror}
            onRemoveWidget={handleRemoveWidget}
            onMoveWidget={handleMoveWidget}
            onUpdateWidgetConfig={handleUpdateWidgetConfig}
            onWidgetEditorStateChange={handleWidgetEditorStateChange}
          />
        </div>

        <EditModeToggle
          disabled={!activeMirror}
          onEnterEditMode={handleEnterEditMode}
          onSave={handleSave}
          onDiscard={handleDiscard}
          onPreview={previewMirror}
          autosaveEnabled={isAutosaveEnabled}
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
