import { GitHubCommitResult, GitHubConfig, SchoolFullData, Teacher } from '../types';
import { saveAllSchoolData, saveGitHubConfig, saveTeachers } from './storage';

export interface GitHubTestResult {
  success: boolean;
  repo?: {
    name: string;
    fullName: string;
    private: boolean;
    defaultBranch: string;
    url: string;
  };
  file?: {
    path: string;
    branch: string;
    exists: boolean;
    sha: string | null;
    teacherCount: number | null;
  };
  error?: string;
}

export interface GitHubPullResult {
  success: boolean;
  teachers?: Teacher[];
  database?: SchoolFullData;
  sha?: string;
  fileUrl?: string;
  total?: number;
  message?: string;
  error?: string;
  partial?: boolean;
}

// 1. Test Connection
export async function testGitHubConnection(config: GitHubConfig): Promise<GitHubTestResult> {
  try {
    const res = await fetch('/api/github/test-connection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: config.token,
        owner: config.owner,
        repo: config.repo,
        branch: config.branch || 'main',
        filePath: config.filePath || 'data/teachers.json',
      }),
    });

    const data = await res.json();
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Gagal menghubungi server untuk verifikasi GitHub.',
    };
  }
}

// 2. Pull Teachers from GitHub
export async function pullTeachersFromGitHub(config: GitHubConfig): Promise<GitHubPullResult> {
  try {
    const res = await fetch('/api/github/pull-teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: config.token,
        owner: config.owner,
        repo: config.repo,
        branch: config.branch || 'main',
        filePath: config.filePath || 'data/teachers.json',
      }),
    });

    const data = await res.json();
    if (data.success && Array.isArray(data.teachers)) {
      saveTeachers(data.teachers);
      const updatedConfig = {
        ...config,
        lastSyncedAt: new Date().toISOString(),
      };
      saveGitHubConfig(updatedConfig);
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Gagal menarik data guru dari GitHub.',
    };
  }
}

// 3. Push Teachers to GitHub
export async function pushTeachersToGitHub(
  config: GitHubConfig,
  teachers: Teacher[],
  commitMessage?: string
): Promise<GitHubCommitResult> {
  try {
    if (!config.token.trim()) {
      return {
        success: false,
        message: 'Personal Access Token (PAT) GitHub belum diisi.',
        error: 'Token GitHub diperlukan untuk melakukan komit perubahan.',
      };
    }

    const res = await fetch('/api/github/commit-teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: config.token,
        owner: config.owner,
        repo: config.repo,
        branch: config.branch || 'main',
        filePath: config.filePath || 'data/teachers.json',
        teachers,
        commitMessage,
        authorName: config.authorName || 'Admin SDN 305 Maluku Tengah',
        authorEmail: config.authorEmail || 'ruslilussy789@gmail.com',
      }),
    });

    const data = await res.json();
    if (data.success) {
      const updatedConfig: GitHubConfig = {
        ...config,
        lastSyncedAt: data.updatedAt || new Date().toISOString(),
        lastCommitSha: data.commitSha,
        lastCommitUrl: data.commitUrl,
      };
      saveGitHubConfig(updatedConfig);
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: 'Gagal mengirim komit ke GitHub.',
      error: error?.message || 'Terjadi kesalahan jaringan.',
    };
  }
}

// 4. Pull Full School Database from GitHub
export async function pullFullDatabaseFromGitHub(config: GitHubConfig): Promise<GitHubPullResult> {
  try {
    const res = await fetch('/api/github/pull-database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: config.token,
        owner: config.owner,
        repo: config.repo,
        branch: config.branch || 'main',
        filePath: config.databaseFilePath || 'data/sdn305_database.json',
      }),
    });

    const data = await res.json();
    if (data.success && data.database) {
      // Save all received school data into local storage
      saveAllSchoolData(data.database);

      const updatedConfig = {
        ...config,
        lastSyncedAt: new Date().toISOString(),
      };
      saveGitHubConfig(updatedConfig);
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error?.message || 'Gagal menarik database dari GitHub.',
    };
  }
}

// 5. Push Full School Database to GitHub
export async function pushFullDatabaseToGitHub(
  config: GitHubConfig,
  database: SchoolFullData,
  commitMessage?: string
): Promise<GitHubCommitResult> {
  try {
    if (!config.token.trim()) {
      return {
        success: false,
        message: 'Personal Access Token (PAT) GitHub belum diisi.',
        error: 'Token GitHub diperlukan untuk menyimpan database ke repositori.',
      };
    }

    const res = await fetch('/api/github/commit-database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token: config.token,
        owner: config.owner,
        repo: config.repo,
        branch: config.branch || 'main',
        filePath: config.databaseFilePath || 'data/sdn305_database.json',
        database,
        commitMessage,
        authorName: config.authorName || 'Admin SDN 305 Maluku Tengah',
        authorEmail: config.authorEmail || 'ruslilussy789@gmail.com',
      }),
    });

    const data = await res.json();
    if (data.success) {
      const updatedConfig: GitHubConfig = {
        ...config,
        lastSyncedAt: data.updatedAt || new Date().toISOString(),
        lastCommitSha: data.commitSha,
        lastCommitUrl: data.commitUrl,
      };
      saveGitHubConfig(updatedConfig);
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      message: 'Gagal mengirim database ke GitHub.',
      error: error?.message || 'Terjadi kesalahan jaringan.',
    };
  }
}
