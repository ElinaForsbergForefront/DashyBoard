import { WidgetSidebar } from '../components/layout/dashboard/WidgetSidebar';
import { EditModeToggle } from '../components/layout/editMode/EditModeToggle';
import { EditModeProvider } from '../context/EditModeContext';
import { useEditModeContext } from '../context/EditModeContext';

function DashboardContent() {
  const { isEditMode } = useEditModeContext();

  return (
    <div className="flex flex-1">
      {isEditMode && <WidgetSidebar />}

      <main
        className={`flex-1 transition-all duration-300 ${
          isEditMode
            ? 'ring-2 ring-primary ring-inset outline-dashed outline-2 -outline-offset-2 outline-primary/30'
            : ''
        }`}
      >
        {isEditMode && (
          <div className="px-4 py-2 bg-primary/10 border-b border-primary/20 text-xs font-medium text-primary tracking-wide">
            EDIT MODE — drag widgets to arrange your layout
          </div>
        )}

        {/* Dashboard widget canvas goes here */}
      </main>

      <EditModeToggle />
    </div>
  );
}

export const Dashboard = () => {
  return (
    <EditModeProvider>
      <DashboardContent />
    </EditModeProvider>
  );
};
