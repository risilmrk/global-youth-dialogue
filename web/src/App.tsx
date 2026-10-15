import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LanguageProvider } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { PortalLayout } from './components/layout/PortalLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';

// Public Pages
import { Home } from './pages/public/Home';
import { About } from './pages/public/About';
import { Mission } from './pages/public/Mission';
import { DialogueCycle } from './pages/public/DialogueCycle';
import { Topics } from './pages/public/Topics';
import { TopicDetail } from './pages/public/TopicDetail';
import { Publications } from './pages/public/Publications';
import { PublicationDetail } from './pages/public/PublicationDetail';
import { Community } from './pages/public/Community';
import { Apply } from './pages/public/Apply';
import { Sessions } from './pages/public/Sessions';

// Auth Pages
import { Login } from './pages/auth/Login';
import { VerifyEmail } from './pages/auth/VerifyEmail';
import { ForgotPassword } from './pages/auth/ForgotPassword';
import { ResetPassword } from './pages/auth/ResetPassword';

// Member Portal Pages
import { PortalDashboard } from './pages/portal/PortalDashboard';
import { PortalSessions } from './pages/portal/PortalSessions';
import { PortalSessionDetail } from './pages/portal/PortalSessionDetail';
import { PortalRecordings } from './pages/portal/PortalRecordings';
import { PortalFeedback } from './pages/portal/PortalFeedback';
import { PortalTopics } from './pages/portal/PortalTopics';
import { PortalPublications } from './pages/portal/PortalPublications';
import { PortalProfile } from './pages/portal/PortalProfile';
import { PortalJourney } from './pages/portal/PortalJourney';
import { PortalSuggestTopic } from './pages/portal/PortalSuggestTopic';
import { PortalTopicBank } from './pages/portal/PortalTopicBank';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 mins
    },
  },
});

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Website Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/mission" element={<Mission />} />
                  <Route path="/dialogue-cycle" element={<DialogueCycle />} />
                  <Route path="/topics" element={<Topics />} />
                  <Route path="/topics/:slug" element={<TopicDetail />} />
                  <Route path="/sessions" element={<Sessions />} />
                  <Route path="/publications" element={<Publications />} />
                  <Route path="/publications/:slug" element={<PublicationDetail />} />
                  <Route path="/community" element={<Community />} />
                  <Route path="/apply" element={<Apply />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/verify-email" element={<VerifyEmail />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                {/* Protected Member Portal Routes */}
                <Route
                  path="/portal"
                  element={
                    <ProtectedRoute>
                      <PortalLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<PortalDashboard />} />
                  <Route path="sessions" element={<PortalSessions />} />
                  <Route path="sessions/:id" element={<PortalSessionDetail />} />
                  <Route path="recordings" element={<PortalRecordings />} />
                  <Route path="feedback" element={<PortalFeedback />} />
                  <Route path="topic-bank" element={<PortalTopicBank />} />
                  <Route path="suggest-topic" element={<PortalSuggestTopic />} />
                  <Route path="topics" element={<PortalSuggestTopic />} />
                  <Route path="journey" element={<PortalJourney />} />
                  <Route path="publications" element={<PortalPublications />} />
                  <Route path="profile" element={<PortalProfile />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
