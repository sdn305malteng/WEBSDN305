import React, { useState, useEffect } from 'react';
import {
  SchoolProfile,
  AccreditationItem,
  AccreditationComponent,
  Teacher,
  Facility,
  NewsItem,
  StudentCohort,
  IASPComponentId,
  GitHubConfig,
  SchoolFullData
} from './types';
import {
  loadSchoolProfile,
  saveSchoolProfile,
  loadAccreditationComponents,
  loadAccreditationItems,
  saveAccreditationItem,
  deleteAccreditationItem,
  loadTeachers,
  saveTeacher,
  saveTeachers,
  deleteTeacher,
  loadFacilities,
  saveFacility,
  deleteFacility,
  loadNews,
  saveNewsItem,
  deleteNewsItem,
  loadStudentCohorts,
  calculateAccreditationStats,
  resetToInitialData,
  getStoredGitHubConfig,
  saveGitHubConfig,
  getAllSchoolData,
  saveAllSchoolData
} from './utils/storage';
import { pushTeachersToGitHub, pullFullDatabaseFromGitHub } from './utils/githubService';

// Public Components
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SchoolProfileSection } from './components/SchoolProfileSection';
import { AccreditationPublicSection } from './components/AccreditationPublicSection';
import { TeachersSection } from './components/TeachersSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { NewsSection } from './components/NewsSection';
import { Footer } from './components/Footer';

// Admin Components
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { DocumentModal } from './components/admin/DocumentModal';
import { TeacherModal } from './components/admin/TeacherModal';
import { FacilityModal } from './components/admin/FacilityModal';
import { NewsModal } from './components/admin/NewsModal';
import { PrintReportView } from './components/admin/PrintReportView';
import { GitHubSyncModal } from './components/admin/GitHubSyncModal';

export function App() {
  // Master State
  const [profile, setProfile] = useState<SchoolProfile>(loadSchoolProfile);
  const [components, setComponents] = useState<AccreditationComponent[]>(loadAccreditationComponents);
  const [items, setItems] = useState<AccreditationItem[]>(loadAccreditationItems);
  const [teachers, setTeachers] = useState<Teacher[]>(loadTeachers);
  const [facilities, setFacilities] = useState<Facility[]>(loadFacilities);
  const [news, setNews] = useState<NewsItem[]>(loadNews);
  const [studentCohorts, setStudentCohorts] = useState<StudentCohort[]>(loadStudentCohorts);

  // App Navigation & Modals
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isPrintOpen, setIsPrintOpen] = useState<boolean>(false);
  const [adminComponentTarget, setAdminComponentTarget] = useState<IASPComponentId | undefined>(undefined);

  // CRUD Modals
  const [itemModalOpen, setItemModalOpen] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<AccreditationItem | null>(null);
  const [defaultCompForModal, setDefaultCompForModal] = useState<IASPComponentId>('mutu-lulusan');

  const [teacherModalOpen, setTeacherModalOpen] = useState<boolean>(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);

  const [facilityModalOpen, setFacilityModalOpen] = useState<boolean>(false);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);

  const [newsModalOpen, setNewsModalOpen] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  // GitHub Sync State
  const [githubConfig, setGithubConfig] = useState<GitHubConfig>(getStoredGitHubConfig);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  const handleSaveGitHubConfig = (cfg: GitHubConfig) => {
    setGithubConfig(cfg);
    saveGitHubConfig(cfg);
  };

  const handleTeachersUpdatedFromGitHub = (newTeachers: Teacher[]) => {
    setTeachers(newTeachers);
    saveTeachers(newTeachers);
  };

  const handleAllSchoolDataUpdated = (data: Partial<SchoolFullData>) => {
    saveAllSchoolData(data);
    if (data.schoolProfile) setProfile(data.schoolProfile);
    if (data.accreditationItems) setItems(data.accreditationItems);
    if (data.teachers) setTeachers(data.teachers);
    if (data.facilities) setFacilities(data.facilities);
    if (data.news) setNews(data.news);
    if (data.studentCohorts) setStudentCohorts(data.studentCohorts);
  };

  // Attempt initial sync from GitHub sdn305malteng/sdn305malukutengah on startup
  useEffect(() => {
    let isMounted = true;
    const initialSync = async () => {
      try {
        const res = await pullFullDatabaseFromGitHub(githubConfig);
        if (isMounted && res.success && res.database) {
          handleAllSchoolDataUpdated(res.database);
        }
      } catch {
        // Offline or fallback to local storage
      }
    };
    initialSync();
    return () => { isMounted = false; };
  }, []);

  const handleSaveTeacherWithGitHub = async (
    teacher: Teacher,
    commitToGitHub: boolean,
    commitMessage?: string
  ) => {
    const updated = saveTeacher(teacher);
    setTeachers(updated);

    if (commitToGitHub && githubConfig.token.trim()) {
      const res = await pushTeachersToGitHub(githubConfig, updated, commitMessage);
      if (res.success) {
        const updatedCfg: GitHubConfig = {
          ...githubConfig,
          lastSyncedAt: new Date().toISOString(),
          lastCommitSha: res.commitSha,
          lastCommitUrl: res.commitUrl
        };
        setGithubConfig(updatedCfg);
        saveGitHubConfig(updatedCfg);
      }
      return res;
    }

    return { success: true, message: 'Data guru tersimpan di penyimpanan lokal.' };
  };

  // Calculated Accreditation Metrics
  const stats = calculateAccreditationStats(items, components);
  const totalStudents = studentCohorts.reduce((acc, c) => acc + c.total, 0);

  // Handlers for Scroll Navigation in Public View
  const handleScrollTo = (sectionId: string) => {
    if (isAdminMode) {
      setIsAdminMode(false);
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }

    if (sectionId === 'beranda') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Admin Flow
  const handleOpenAdmin = (componentFilter?: IASPComponentId) => {
    setAdminComponentTarget(componentFilter);
    setIsAdminMode(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profile Save
  const handleSaveProfile = (newProfile: SchoolProfile) => {
    setProfile(newProfile);
    saveSchoolProfile(newProfile);
  };

  // Item Save & Delete
  const handleSaveItem = (item: AccreditationItem) => {
    const updated = saveAccreditationItem(item);
    setItems(updated);
  };

  const handleDeleteItem = (id: string) => {
    const updated = deleteAccreditationItem(id);
    setItems(updated);
  };

  // Teacher Save & Delete
  const handleSaveTeacher = (teacher: Teacher) => {
    const updated = saveTeacher(teacher);
    setTeachers(updated);
  };

  const handleDeleteTeacher = (id: string) => {
    const updated = deleteTeacher(id);
    setTeachers(updated);
  };

  // Facility Save & Delete
  const handleSaveFacility = (facility: Facility) => {
    const updated = saveFacility(facility);
    setFacilities(updated);
  };

  const handleDeleteFacility = (id: string) => {
    const updated = deleteFacility(id);
    setFacilities(updated);
  };

  // News Save & Delete
  const handleSaveNews = (newsItem: NewsItem) => {
    const updated = saveNewsItem(newsItem);
    setNews(updated);
  };

  const handleDeleteNews = (id: string) => {
    const updated = deleteNewsItem(id);
    setNews(updated);
  };

  // Reset Data to Official Defaults
  const handleResetData = () => {
    resetToInitialData();
    setProfile(loadSchoolProfile());
    setComponents(loadAccreditationComponents());
    setItems(loadAccreditationItems());
    setTeachers(loadTeachers());
    setFacilities(loadFacilities());
    setNews(loadNews());
    setStudentCohorts(loadStudentCohorts());
  };

  // Modal Openers
  const handleOpenItemModal = (item?: AccreditationItem | null, compId?: IASPComponentId) => {
    setSelectedItem(item || null);
    if (compId) setDefaultCompForModal(compId);
    setItemModalOpen(true);
  };

  const handleOpenTeacherModal = (teacher?: Teacher | null) => {
    setSelectedTeacher(teacher || null);
    setTeacherModalOpen(true);
  };

  const handleOpenFacilityModal = (facility?: Facility | null) => {
    setSelectedFacility(facility || null);
    setFacilityModalOpen(true);
  };

  const handleOpenNewsModal = (newsItem?: NewsItem | null) => {
    setSelectedNews(newsItem || null);
    setNewsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-emerald-500 selection:text-white antialiased">
      
      {/* If Admin Mode is active, show the master Admin Dashboard */}
      {isAdminMode ? (
        <AdminDashboard
          profile={profile}
          components={components}
          items={items}
          teachers={teachers}
          facilities={facilities}
          news={news}
          stats={stats}
          initialComponentFilter={adminComponentTarget}
          onSaveProfile={handleSaveProfile}
          onSaveItem={handleSaveItem}
          onDeleteItem={handleDeleteItem}
          onSaveTeacher={handleSaveTeacher}
          onDeleteTeacher={handleDeleteTeacher}
          onSaveFacility={handleSaveFacility}
          onDeleteFacility={handleDeleteFacility}
          onSaveNews={handleSaveNews}
          onDeleteNews={handleDeleteNews}
          onResetData={handleResetData}
          onOpenPrint={() => setIsPrintOpen(true)}
          onExitAdmin={() => setIsAdminMode(false)}
          onOpenItemModal={handleOpenItemModal}
          onOpenTeacherModal={handleOpenTeacherModal}
          onOpenFacilityModal={handleOpenFacilityModal}
          onOpenNewsModal={handleOpenNewsModal}
          githubConfig={githubConfig}
          onSaveGitHubConfig={handleSaveGitHubConfig}
          onTeachersUpdated={handleTeachersUpdatedFromGitHub}
          onOpenGitHubSyncModal={() => setIsGitHubModalOpen(true)}
          allSchoolData={getAllSchoolData()}
          onAllSchoolDataUpdated={handleAllSchoolDataUpdated}
        />
      ) : (
        /* Public School Website View */
        <div>
          {/* Top Sticky Header */}
          <Header
            profile={profile}
            stats={stats}
            readinessPercentage={stats.percentage}
            isAdminLoggedIn={isAdminMode}
            onOpenAdmin={() => setIsLoginModalOpen(true)}
            onOpenAdminLogin={() => setIsLoginModalOpen(true)}
            onNavigate={handleScrollTo}
          />

          {/* Main Hero with Accreditation Index */}
          <HeroSection
            profile={profile}
            stats={stats}
            totalStudents={totalStudents}
            totalTeachers={teachers.length}
            totalFacilities={facilities.length}
            onOpenAdmin={() => setIsLoginModalOpen(true)}
            onNavigateToAccreditation={() => handleScrollTo('akreditasi')}
            onPrintPreview={() => setIsPrintOpen(true)}
          />

          {/* School Profile, Vision, Missions, Official Identity */}
          <SchoolProfileSection
            profile={profile}
            studentCohorts={studentCohorts}
          />

          {/* 4 Components of IASP Accreditation */}
          <AccreditationPublicSection
            components={components}
            items={items}
            onOpenAdmin={(compFilter) => {
              setAdminComponentTarget(compFilter);
              setIsLoginModalOpen(true);
            }}
          />

          {/* Teachers & Education Personnel Directory */}
          <TeachersSection
            teachers={teachers}
            onOpenAdmin={() => setIsLoginModalOpen(true)}
          />

          {/* Facilities & Infrastructure */}
          <FacilitiesSection
            facilities={facilities}
            onOpenAdmin={() => setIsLoginModalOpen(true)}
          />

          {/* News & Announcements */}
          <NewsSection
            news={news}
            onOpenAdmin={() => setIsLoginModalOpen(true)}
          />

          {/* Footer */}
          <Footer
            profile={profile}
            onNavigate={handleScrollTo}
            onOpenAdmin={() => setIsLoginModalOpen(true)}
          />
        </div>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          setIsLoginModalOpen(false);
          setIsAdminMode(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Print / PDF Document Report Modal */}
      {isPrintOpen && (
        <PrintReportView
          profile={profile}
          components={components}
          items={items}
          stats={stats}
          onClose={() => setIsPrintOpen(false)}
        />
      )}

      {/* Document / Physical Evidence Modal */}
      <DocumentModal
        isOpen={itemModalOpen}
        onClose={() => setItemModalOpen(false)}
        onSave={handleSaveItem}
        initialItem={selectedItem}
        defaultComponentId={defaultCompForModal}
      />

      {/* Teacher Modal with GitHub Sync */}
      <TeacherModal
        isOpen={teacherModalOpen}
        onClose={() => setTeacherModalOpen(false)}
        onSave={handleSaveTeacher}
        onSaveWithGitHub={handleSaveTeacherWithGitHub}
        initialTeacher={selectedTeacher}
        githubConfig={githubConfig}
        onOpenGitHubConfig={() => setIsGitHubModalOpen(true)}
      />

      {/* Facility Modal */}
      <FacilityModal
        isOpen={facilityModalOpen}
        onClose={() => setFacilityModalOpen(false)}
        onSave={handleSaveFacility}
        initialFacility={selectedFacility}
      />

      {/* News Modal */}
      <NewsModal
        isOpen={newsModalOpen}
        onClose={() => setNewsModalOpen(false)}
        onSave={handleSaveNews}
        initialNews={selectedNews}
      />

      {/* GitHub Repository Sync Modal */}
      <GitHubSyncModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        config={githubConfig}
        onSaveConfig={handleSaveGitHubConfig}
        currentTeachers={teachers}
        onTeachersUpdated={handleTeachersUpdatedFromGitHub}
        allSchoolData={getAllSchoolData()}
        onAllSchoolDataUpdated={handleAllSchoolDataUpdated}
      />

    </div>
  );
}

export default App;
