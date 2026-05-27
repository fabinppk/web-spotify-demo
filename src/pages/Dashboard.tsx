import { ScrollArea } from "@/components/ui/scroll-area";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { MainPanel } from "@/components/layout/MainPanel";
import { PlayerBar } from "@/components/layout/PlayerBar";

const Dashboard = () => {
  return (
    <div
      className="flex flex-col h-screen bg-bg"
      data-testid="dashboard-element"
    >
      <Header />
      <div className="flex flex-1 gap-2 px-2 pb-2 min-h-0 overflow-hidden mb-16 md:mb-[90px]">
        <Sidebar />
        <ScrollArea className="flex-1 min-w-0 bg-surface rounded-lg">
          <MainPanel />
        </ScrollArea>
      </div>
      <PlayerBar />
    </div>
  );
};

export default Dashboard;
