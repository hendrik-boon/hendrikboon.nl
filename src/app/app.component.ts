import { Component, OnInit } from '@angular/core';

import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { StravaService, StravaStats } from './services/strava.service';
import { GitHubReleaseService, GitHubRelease } from './services/github-release.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  stats: StravaStats | null = null;
  stravaLoading = true;
  stravaError = false;

  latestRelease: GitHubRelease | null = null;
  releaseLoading = true;
  releaseError = false;

  currentYear = new Date().getFullYear();

  constructor(
    public stravaService: StravaService,
    public githubReleaseService: GitHubReleaseService
  ) {}

  ngOnInit(): void {
    this.stravaService.getStats()
      .then(data => {
        this.stats = data;
        this.stravaLoading = false;
      })
      .catch(() => {
        this.stravaError = true;
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
}
