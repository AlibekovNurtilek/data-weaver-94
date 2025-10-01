import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AppSidebar } from "@/components/AppSidebar";
import { Provider } from "react-redux";
import { store } from "./store";

import Login from "./pages/Login";
import Sentences from "./pages/Sentences";
import SentenceDetail from "./pages/SentenceDetail";
import CreateData from "./pages/CreateData";
import Users from "./pages/Users";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <SidebarProvider>
                      <div className="flex min-h-screen w-full">
                        <AppSidebar />
                        <main className="flex-1 overflow-hidden">
                         <header className="flex h-12 items-center border-b border-border bg-background px-4 md:hidden">
                            <SidebarTrigger className="mr-4" />
                          </header>
                          <div className="p-6">
                            <Routes>
                              <Route path="/" element={<Sentences />} />
                              <Route path="/sentences" element={<Sentences />} />
                              <Route path="/sentences/:id" element={<SentenceDetail />} />
                              <Route
                                path="/create-data"
                                element={
                                  <ProtectedRoute adminOnly>
                                    <CreateData />
                                  </ProtectedRoute>
                                }
                              />
                              <Route
                                path="/users"
                                element={
                                  <ProtectedRoute adminOnly>
                                    <Users />
                                  </ProtectedRoute>
                                }
                              />
                              <Route path="*" element={<NotFound />} />
                            </Routes>
                          </div>
                        </main>
                      </div>
                    </SidebarProvider>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
