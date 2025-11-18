import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HttpClientModule } from '@angular/common/http';   // ← you can keep or remove this now
import { StravaService, StravaStats } from './services/strava.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, HttpClientModule],
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
