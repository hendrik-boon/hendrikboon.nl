import { Component, OnInit } from '@angular/core';

import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';
import { StravaService, StravaStats } from './services/strava.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NavbarComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  stats: StravaStats | null = null;
  loading = true;
  error = false;

  constructor(public stravaService: StravaService) {}

  ngOnInit(): void {
    this.stravaService.getStats()
      .then(data => {
        this.stats = data;
        this.loading = false;
      })
      .catch(() => {
        this.error = true;
        this.loading = false;
      });
  }
}
