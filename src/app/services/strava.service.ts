import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

export interface StravaStats {
  biggest_ride_distance: number;
  biggest_climb_elevation_gain: number;
  all_ride_totals: { count: number; distance: number; elevation_gain: number; moving_time: number };
  ytd_ride_totals: { count: number; distance: number; elevation_gain: number; moving_time: number };
  all_run_totals: { count: number; distance: number; elevation_gain: number; moving_time: number };
  ytd_run_totals: { count: number; distance: number; elevation_gain: number; moving_time: number };
}

@Injectable({ providedIn: 'root' })
export class StravaService {
  private http = inject(HttpClient);
  private apiUrl = 'https://hendrikboon.nl/api/strava/strava-stats.php';

  async getStats(): Promise<StravaStats> {
    return lastValueFrom(this.http.get<StravaStats>(this.apiUrl));
  }

  formatDistance(meters: number): string {
    return (meters / 1000).toFixed(1);
  }

  formatMovingTime(seconds: number): string {
    if (!seconds) return '0m';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h === 0) return `${m}m`;
    return `${h}h ${m.toString().padStart(2, '0')}m`;
  }
}
