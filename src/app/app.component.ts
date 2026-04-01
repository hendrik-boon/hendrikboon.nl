import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { StravaService, StravaStats, StravaActivity } from './services/strava.service';
import { GitHubReleaseService, GitHubRelease } from './services/github-release.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, HttpClientModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private readonly PAGE_SIZE = 4;

  stats: StravaStats | null = null;
  stravaLoading = true;

  loadingMore = false;
  hasMoreActivities = true;
  currentPage = 1;

  recentActivities: StravaActivity[] = [];

  latestRelease: GitHubRelease | null = null;
  releaseLoading = true;
  releaseError = false;

  currentYear = new Date().getFullYear();

  constructor(
    public stravaService: StravaService,
    public githubReleaseService: GitHubReleaseService
  ) {}

  ngOnInit(): void {
    this.loadMoreActivities();
    this.stravaService.getStats()
      .then(data => {
        this.stats = data;
        this.stravaLoading = false;
      })
      .catch(() => {
        this.stravaLoading = false;
      });

    this.githubReleaseService.getLatestRelease()
      .then(data => {
        this.latestRelease = data;
        this.releaseLoading = false;
      })
      .catch(() => {
        this.releaseError = true;
        this.releaseLoading = false;
      });
  }
  async loadMoreActivities() {
    if (this.loadingMore) return;
    this.loadingMore = true;

    try {
      const newActivities = await this.stravaService.getRecentActivities(this.PAGE_SIZE, this.currentPage);

      this.recentActivities = [...this.recentActivities, ...newActivities];
      this.currentPage++;

      if (newActivities.length < this.PAGE_SIZE) {
        this.hasMoreActivities = false;
      }
    } catch (err) {
      console.warn('Failed to load more activities', err);
    } finally {
      this.loadingMore = false;
    }
  }
}
