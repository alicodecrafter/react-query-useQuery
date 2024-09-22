import { createRoot } from "react-dom/client";
import App from "./app.tsx";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ToastContainer position={"bottom-center"} autoClose={1500} />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>,
);
