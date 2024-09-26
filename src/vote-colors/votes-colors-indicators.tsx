import { useFetchColors } from "@/vote-colors/hooks/use-fetch-colors.ts";

/*const longSimulatorTask = () => {
  const start = Date.now();
  while (Date.now() - start < 1500) {
    // Do nothing
  }
};*/

export const VotesColorsIndicators = () => {
  const { data: colors, isLoading } = useFetchColors({
    select: (colors) =>
      colors.map((color) => ({
        name: color.name,
        bg: color.bg,
      })),
  });

  console.log("Render");

  /*longSimulatorTask();*/

  return (
    <div>
      {isLoading && (
        <div className="animate-pulse flex space-x-2">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="w-6 h-6 rounded-full bg-gray-200"></div>
          ))}
        </div>
      )}

      {!isLoading && Boolean(colors?.length) && (
        <div className="flex space-x-2">
          {colors?.map((color) => (
            <div
              key={color.name}
              style={{
                backgroundColor: color.bg,
              }}
              className={`w-6 h-6 rounded-full border-2 border-white shadow-sm`}
              title={color.name}
            ></div>
          ))}
        </div>
      )}
    </div>
  );
};
