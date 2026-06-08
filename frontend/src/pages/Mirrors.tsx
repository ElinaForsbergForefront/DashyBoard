import { Check, LayoutGrid, Pencil, X } from 'lucide-react';
import { WidgetSidebar } from '../components/layout/dashboard/WidgetSidebar';
import { MirrorEditorModals } from '../components/mirrors/MirrorEditorModals';
import { MirrorSubNav } from '../components/layout/navigation/sub-navigation/MirrorSubNav';
import { EditModeProvider } from '../context/EditModeContext';
import { useEditModeContext } from '../context/EditModeContext';
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
    lastSavedAt,
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
    canAddWidget,
  } = useMirrorEditor();
  const { toggleSidebar } = useEditModeContext();

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
        isEditMode={isEditMode}
        autosaveEnabled={isAutosaveEnabled}
        onToggleAutosave={handleToggleAutosave}
        lastSavedAt={lastSavedAt}
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
                  autosaveStatus === 'saved' || autosaveStatus === 'saved-manual'
                    ? 'border-emerald-300/50 bg-emerald-500/18 text-emerald-50'
                    : autosaveStatus === 'saving'
                      ? 'border-emerald-300/40 bg-emerald-500/12 text-emerald-100'
                      : 'border-red-300/50 bg-red-500/14 text-red-100'
                }`}
                aria-live="polite"
              >
                {autosaveStatus === 'saved'
                  ? 'Autosaved'
                  : autosaveStatus === 'saved-manual'
                    ? 'Saved'
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
      </div>

      {!isEditMode && activeMirrorId && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
          <button
            onClick={handleEnterEditMode}
            aria-label="Enter edit mode"
            className="w-12 h-12 rounded-full bg-surface border border-border text-muted hover:text-foreground hover:border-primary hover:shadow-[0_0_0_3px_rgba(51,153,255,0.15)] transition-all duration-200 flex items-center justify-center cursor-pointer group"
          >
            <Pencil size={18} className="group-hover:rotate-12 transition-transform duration-200" />
          </button>
        </div>
      )}

      {isEditMode && (
        <button
          onClick={toggleSidebar}
          aria-label="Open widgets"
          className="xl:hidden fixed bottom-6 left-6 z-50 w-12 h-12 rounded-full bg-surface border border-border text-muted hover:text-foreground hover:border-primary transition-all duration-200 flex items-center justify-center cursor-pointer animate-in fade-in slide-in-from-bottom-4 duration-300"
        >
          <LayoutGrid size={18} />
        </button>
      )}

      {isEditMode && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {typeof isAutosaveEnabled === 'boolean' && (
            <div className="flex xl:hidden items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-surface/90 backdrop-blur-sm shadow-lg">
              <span className="text-xs font-medium text-foreground">Autosave</span>
              <button
                type="button"
                onClick={handleToggleAutosave}
                aria-label={`Turn autosave ${isAutosaveEnabled ? 'off' : 'on'}`}
                role="switch"
                aria-checked={isAutosaveEnabled}
                className="cursor-pointer relative inline-flex h-5 w-9 items-center rounded-full border border-white/10 bg-overlay transition-all duration-300"
              >
                <div
                  className={`relative inline-flex h-4 w-4 items-center justify-center rounded-full border border-white/20 bg-surface shadow-sm transition-all duration-300 ${
                    isAutosaveEnabled ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                  aria-hidden="true"
                >
                  {isAutosaveEnabled ? (
                    <Check size={10} className="text-emerald-400" strokeWidth={3} />
                  ) : (
                    <X size={10} className="text-foreground-secondary" strokeWidth={3} />
                  )}
                </div>
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDiscard}
              className="px-4 py-2 rounded-full text-sm font-medium border border-border bg-surface text-foreground-secondary hover:text-foreground hover:bg-overlay transition-all cursor-pointer"
            >
              Discard
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-white hover:bg-primary-hover transition-all cursor-pointer shadow-lg"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const Mirrors = () => (
  <EditModeProvider>
    <MirrorContent />
  </EditModeProvider>
);
