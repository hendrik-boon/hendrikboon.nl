import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface GitHubRelease {
  tag_name: string;
  name: string;
  published_at: string;
  html_url: string;
}

@Injectable({ providedIn: 'root' })
export class GitHubReleaseService {
  private http = inject(HttpClient);

  private apiUrl = 'https://api.github.com/repos/hendrik-boon/hendrikboon.nl/releases/latest';

  async getLatestRelease(): Promise<GitHubRelease | null> {
    try {
      return await lastValueFrom(
        this.http.get<GitHubRelease>(this.apiUrl)
      );
    } catch (error) {
      console.error('Could not load latest GitHub release:', error);
      return null;
    }
  }

  formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
