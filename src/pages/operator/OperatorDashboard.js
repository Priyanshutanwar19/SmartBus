import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { operatorBusAPI, operatorRouteAPI, operatorScheduleAPI } from '../../services/operatorApi';
import OperatorSidebar from '../../components/operator/OperatorSidebar';
import OperatorHeader from '../../components/operator/OperatorHeader';
import './OperatorDashboard.css';

export default function OperatorDashboard() {
  const [stats, setStats] = useState({
    totalBuses: 0,
    totalRoutes: 0,
    totalSchedules: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [busesRes, routesRes, schedulesRes] = await Promise.all([
        operatorBusAPI.getBuses(),
        operatorRouteAPI.getRoutes(),
        operatorScheduleAPI.getSchedules(),
      ]);

      setStats({
        totalBuses: busesRes.data?.buses?.length || 0,
        totalRoutes: routesRes.data?.routes?.length || 0,
        totalSchedules: schedulesRes.data?.schedules?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="operator-layout">
      <OperatorSidebar />
      <div className="operator-main">
        <OperatorHeader title="Dashboard" />
        <div className="operator-content">
          {loading ? (
            <div className="operator-loading">Loading...</div>
          ) : (
            <>
              <div className="operator-stats-grid">
                <div className="operator-stat-card">
                  <div className="operator-stat-header">
                    <h3>Total Buses</h3>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="operator-stat-number">{stats.totalBuses}</div>
                </div>

                <div className="operator-stat-card">
                  <div className="operator-stat-header">
                    <h3>Total Routes</h3>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.553-.894L9 7m0 0l6-3.446m0 0l5.447-2.724A1 1 0 0121 5.618v10.764a1 1 0 01-1.553.894L15 13m0 0l-6 3.446m0 0v5.370m0-5.370v-5.370m0 5.370l6-3.446m6-3.446V5.618m0 10.764V5.618m0 10.764l-5.447 2.724M15 13l-6-3.446" />
                    </svg>
                  </div>
                  <div className="operator-stat-number">{stats.totalRoutes}</div>
                </div>

                <div className="operator-stat-card">
                  <div className="operator-stat-header">
                    <h3>Total Schedules</h3>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="operator-stat-number">{stats.totalSchedules}</div>
                </div>
              </div>

              <div className="operator-info-section">
                <h2>Quick Actions</h2>
                <div className="operator-quick-actions">
                  <div className="operator-action-card">
                    <div className="operator-action-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3>Add New Bus</h3>
                    <p>Register a new bus to your fleet</p>
                  </div>

                  <div className="operator-action-card">
                    <div className="operator-action-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3>Create Route</h3>
                    <p>Define a new bus route</p>
                  </div>

                  <div className="operator-action-card">
                    <div className="operator-action-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <h3>Add Schedule</h3>
                    <p>Create a new bus schedule</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
