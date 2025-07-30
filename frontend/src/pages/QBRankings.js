import React, { useState, useEffect } from 'react';
import axios from '../config';
import Navbar from '../components/Navbar';
import Comments from '../components/Comments';
import '../styles/common.css';
import './QBRankings.css';

function QBRankings() {
  const [rankings, setRankings] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedWeek, setSelectedWeek] = useState('');
  const [loading, setLoading] = useState(false);

  // Load from URL first, then localStorage as fallback
  useEffect(() => {
    const url = new URL(window.location.href);
    const yearParam = url.searchParams.get('year');
    const weekParam = url.searchParams.get('week');
    
    console.log('Initial load - URL params:', { yearParam, weekParam });
    
    if (yearParam) {
      console.log('Setting year from URL:', yearParam);
      setSelectedYear(yearParam);
    } else {
      const savedYear = localStorage.getItem('qb_selectedYear') || '2024';
      console.log('Setting year from localStorage:', savedYear);
      setSelectedYear(savedYear);
    }
    
    if (weekParam) {
      console.log('Setting week from URL:', weekParam);
      setSelectedWeek(weekParam);
    } else {
      const savedWeek = localStorage.getItem('qb_selectedWeek') || '1';
      console.log('Setting week from localStorage:', savedWeek);
      setSelectedWeek(savedWeek);
    }
  }, []);

  // Save to localStorage when selection changes
  useEffect(() => {
    // Only save if we have valid values (not empty strings)
    if (selectedYear && selectedWeek) {
      localStorage.setItem('qb_selectedYear', selectedYear);
      localStorage.setItem('qb_selectedWeek', selectedWeek);
    }
  }, [selectedYear, selectedWeek]);

  // Update URL when selection changes
  useEffect(() => {
    // Only update URL if we have valid values
    if (selectedYear && selectedWeek) {
      const url = new URL(window.location.href);
      url.searchParams.set('year', selectedYear);
      url.searchParams.set('week', selectedWeek);
      window.history.replaceState({}, '', url);
    }
  }, [selectedYear, selectedWeek]);

  // Fetch rankings when year or week changes
  useEffect(() => {
    // Don't fetch until we have valid year and week values
    if (!selectedYear || !selectedWeek) {
      return;
    }

    const fetchRankings = async () => {
      setLoading(true);
      try {
        console.log('Fetching rankings for:', selectedYear, selectedWeek);
        const response = await axios.get(`/blog/qb-rankings/data?year=${selectedYear}&week=${selectedWeek}`);
        console.log('API response:', response.data);
        setRankings(response.data);
      } catch (error) {
        console.error('Error fetching rankings:', error);
        console.error('Error details:', error.response?.data);
        setRankings([]);
      }
      setLoading(false);
    };

    fetchRankings();
  }, [selectedYear, selectedWeek]);

  const renderRankings = () => {
    // Show loading while initializing
    if (!selectedYear || !selectedWeek) {
      return <p>Loading...</p>;
    }

    if (loading) {
      return <p>Loading...</p>;
    }

    if (!rankings || rankings.length === 0) {
      return <p>No QB rankings found.</p>;
    }

    const currentRow = rankings[0];
    const prevRow = rankings.length > 1 ? rankings[1] : null;
    
    // Build previous rankings lookup
    const prevRankings = {};
    if (prevRow) {
      for (let i = 1; i <= 10; i++) {
        const qb = prevRow[i.toString()];
        if (qb && qb.trim() !== '') {
          prevRankings[qb.trim()] = i;
        }
      }
    }

    const rankingsList = [];
    
    // Render 1-10 rankings
    for (let i = 1; i <= 10; i++) {
      const qb = currentRow[i.toString()] || '';
      let move = '';
      
      if (qb && qb.trim() !== '' && prevRow) {
        const prevRank = prevRankings[qb.trim()];
        if (prevRank !== undefined) {
          const diff = prevRank - i;
          if (diff > 0) move = <span className="move-up">↑{diff}</span>;
          else if (diff < 0) move = <span className="move-down">↓{Math.abs(diff)}</span>;
          else move = <span className="move-same">—</span>;
        } else {
          move = <span className="move-new">NEW</span>;
        }
      }

      rankingsList.push(
        <div key={i} className="ranking-row">
          <div className="move-indicator">{move}</div>
          <span className="ranking-number">{i}.</span>
          <span className="player-name">{qb}</span>
        </div>
      );
    }

    // Add HM if present
    if (currentRow.HM && currentRow.HM.trim() !== '') {
      rankingsList.push(
        <div key="hm" className="ranking-row hm-row">
          <div className="move-indicator"></div>
          <span className="ranking-number">HM:</span>
          <span className="player-name">{currentRow.HM}</span>
        </div>
      );
    }

    // Add supplemental string if present
    if (currentRow.supplemental_string && currentRow.supplemental_string.trim() !== '') {
      rankingsList.push(
        <div key="supplemental" className="supplemental-text">
          {currentRow.supplemental_string}
        </div>
      );
    }

    return <div className="rankings-text">{rankingsList}</div>;
  };

  const renderYearTabs = () => {
    return [2024, 2025].map(year => (
      <button
        key={year}
        className={`tab-btn ${String(year) === selectedYear ? 'active' : ''}`}
        onClick={() => {
          console.log('Year clicked:', year);
          setSelectedYear(String(year));
          setSelectedWeek('1');
          // Force save to localStorage immediately
          localStorage.setItem('qb_selectedYear', String(year));
          localStorage.setItem('qb_selectedWeek', '1');
        }}
      >
        {year}
      </button>
    ));
  };

  const renderWeekTabs = () => {
    return Array.from({ length: 17 }, (_, i) => i + 1).map(week => (
      <button
        key={week}
        className={`tab-btn ${String(week) === selectedWeek ? 'active' : ''}`}
        onClick={() => {
          console.log('Week clicked:', week);
          setSelectedWeek(String(week));
          // Force save to localStorage immediately
          localStorage.setItem('qb_selectedWeek', String(week));
        }}
      >
        {week}
      </button>
    ));
  };

  // Create week identifier for comments (format: "2024-01" for year 2024, week 1)
  const getWeekIdentifier = () => {
    if (!selectedYear || !selectedWeek) return null;
    return `${selectedYear}-${selectedWeek.padStart(2, '0')}`;
  };

  return (
    <div className="page-container">
      <Navbar />
      <div className="page-content">
        <h1 className="page-title">NFL QB Rankings</h1>
        <div className="qb-rankings-container">
          <div className="tabs-container">
            <div className="year-tabs">
              <div className="tab-label">Year</div>
              {renderYearTabs()}
            </div>
            <div className="week-tabs">
              <div className="tab-label">Week</div>
              {renderWeekTabs()}
            </div>
          </div>
          <div className="rankings-content">
            {renderRankings()}
          </div>
        </div>
        
        {/* Comments Section */}
        {getWeekIdentifier() && (
          <Comments week={getWeekIdentifier()} />
        )}
      </div>
    </div>
  );
}

export default QBRankings; 