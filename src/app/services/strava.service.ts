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

export interface StravaActivity {
  id: number;
  name: string;
  sport_type: string;
  type: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  start_date_local: string;
  average_heartrate?: number;
}

@Injectable({ providedIn: 'root' })
export class StravaService {
  private readonly ACTIVITIES_START_DATE = '2020-01-01T00:00:00';

  private http = inject(HttpClient);
  private statsUrl = 'https://hendrikboon.nl/api/strava/strava-stats.php';
  private activitiesUrl = 'https://hendrikboon.nl/api/strava/strava-ytd-activities.php';

  async getStats(): Promise<StravaStats> {
    return lastValueFrom(this.http.get<StravaStats>(this.statsUrl));
  }

  async getActivities(params: {
    before: number;
    after: number;
    page: number;
    per_page: number;
  }): Promise<StravaActivity[]> {

    const queryParams = new URLSearchParams({
      before: params.before.toString(),
      after: params.after.toString(),
      page: params.page.toString(),
      per_page: params.per_page.toString()
    });

    const url = `${this.activitiesUrl}?${queryParams.toString()}`;
    return lastValueFrom(this.http.get<StravaActivity[]>(url));
  }

async getRecentActivities(count: number, page: number): Promise<StravaActivity[]> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const startTimestamp = Math.floor(new Date(this.ACTIVITIES_START_DATE).getTime() / 1000);

      return await this.getActivities({
        before: now,
        after: startTimestamp,
        page: page,
        per_page: count
      });
    } catch (err) {
      console.warn('Failed to load recent activities', err);
      return [];
    }
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
