'use client';

import React, { useState, useEffect } from 'react';
import SettingsPanel from '@/components/SettingsPanel';
import PracticeSheetPreview from '@/components/PracticeSheetPreview';
import { PracticeSheetConfig, DEFAULT_PRACTICE_SHEET_CONFIG } from '@/types';

export default function Home() {
  const [config, setConfig] = useState<PracticeSheetConfig>(DEFAULT_PRACTICE_SHEET_CONFIG);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load config from localStorage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('practice-sheet-config');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
      } catch (error) {
        console.error('Failed to load saved config:', error);
      }
    }
  }, []);

  // Save config to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('practice-sheet-config', JSON.stringify(config));
  }, [config]);

  const handleConfigChange = (newConfig: PracticeSheetConfig) => {
    setConfig(newConfig);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main App Section */}
      <section className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-6">
            {/* Mobile Menu Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="w-full flex justify-between items-center p-3 bg-white rounded-lg shadow-sm border"
              >
                <span className="font-medium text-gray-900">设置</span>
                <svg
                  className={`h-4 w-4 transform transition-transform ${
                    isMobileMenuOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>

            {/* Settings Panel */}
            <div className={`lg:col-span-4 ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}`}>
              <div className="sticky top-6">
                <SettingsPanel
                  config={config}
                  onConfigChange={handleConfigChange}
                />
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-8 mt-6 lg:mt-0">
              <PracticeSheetPreview config={config} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}