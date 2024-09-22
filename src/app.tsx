import { useState } from "react";
import { VoteColorsList } from "@/vote-colors/votes-colors-list.tsx";
import { VotesColorsIndicators } from "@/vote-colors/votes-colors-indicators.tsx";
import { VotesColorsCreate } from "@/vote-colors/votes-colors-create.tsx";

function App() {
  const [activeTab, setActiveTab] = useState<"vote" | "create">("vote");

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Color Vote App</h1>
          <VotesColorsIndicators />
        </div>
      </header>
      <div className="flex max-w-xs w-full  mx-auto my-4">
        <button
          className={`flex-1 py-2 px-4 text-center ${activeTab === "vote" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} rounded-l-md focus:outline-none transition-colors duration-200`}
          onClick={() => setActiveTab("vote")}
        >
          Проголосовать
        </button>
        <button
          className={`flex-1 py-2 px-4 text-center ${activeTab === "create" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"} rounded-r-md focus:outline-none transition-colors duration-200`}
          onClick={() => setActiveTab("create")}
        >
          Создать
        </button>
      </div>

      <main className="flex justify-center my-4">
        {activeTab === "vote" && <VoteColorsList />}

        {activeTab === "create" && (
          <VotesColorsCreate
            handleAddedColor={() => {
              setActiveTab("vote");
            }}
          />
        )}
      </main>
    </div>
  );
}

export default App;
