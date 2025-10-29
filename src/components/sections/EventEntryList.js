'use client';

import { useState } from 'react';

export default function EventEntryList({ entries, categories }) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Sort entries by race number
  const sortedEntries = [...entries].sort((a, b) => (a.number || 0) - (b.number || 0));

  // Filter entries by category
  const filteredEntries = selectedCategory === 'all' 
    ? sortedEntries 
    : sortedEntries.filter(entry => entry.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Categories Filter - Racing Style */}
      {Array.isArray(categories) && categories.length > 0 && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-900 p-6 shadow-2xl border border-neutral-700">
          {/* Racing stripes background */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-y-0 left-0 w-1 bg-red-500"></div>
            <div className="absolute inset-y-0 left-2 w-1 bg-white"></div>
            <div className="absolute inset-y-0 right-0 w-1 bg-red-500"></div>
            <div className="absolute inset-y-0 right-2 w-1 bg-white"></div>
          </div>
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-1 h-7 bg-red-600"></div>
              <h3 className="text-2xl font-black uppercase tracking-wider text-white">
                Race Categories
              </h3>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {/* All Categories Button */}
              <button
                onClick={() => setSelectedCategory('all')}
                className={`group relative px-5 py-3 font-bold text-sm uppercase tracking-wide rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50'
                    : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
                }`}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                  </svg>
                  All
                  <span className="ml-1.5 px-2 py-0.5 bg-black/30 rounded text-xs font-mono">
                    {entries.length}
                  </span>
                </span>
                {selectedCategory === 'all' && (
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                )}
              </button>
              
              {/* Individual Category Buttons */}
              {categories.map((cat, idx) => {
                const categoryName = typeof cat === 'string' ? cat : cat.Name || cat.name;
                const categoryEntries = entries.filter(e => e.category === categoryName);
                
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedCategory(categoryName)}
                    className={`group relative px-5 py-3 font-bold text-sm uppercase tracking-wide rounded-lg transition-all duration-300 transform hover:scale-105 ${
                      selectedCategory === categoryName
                        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/50'
                        : 'bg-neutral-700 text-neutral-200 hover:bg-neutral-600'
                    }`}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {categoryName}
                      <span className="ml-1.5 px-2 py-0.5 bg-black/30 rounded text-xs font-mono">
                        {categoryEntries.length}
                      </span>
                    </span>
                    {selectedCategory === categoryName && (
                      <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Entry List - Racing Grid Style */}
      {filteredEntries.length > 0 && (
        <div className="relative overflow-hidden rounded-xl bg-white shadow-xl border border-neutral-200">
          {/* Header with racing stripe */}
          <div className="relative bg-gradient-to-r from-neutral-900 via-neutral-800 to-neutral-900 px-6 py-5 border-b-4 border-red-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-1 h-10 bg-red-600"></div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-wider text-white">
                    Starting Grid
                  </h2>
                  <p className="text-sm text-neutral-400 uppercase tracking-wide mt-1">
                    {filteredEntries.length} {selectedCategory === 'all' ? 'Total' : selectedCategory} Entries
                  </p>
                </div>
              </div>
              {selectedCategory !== 'all' && (
                <div className="px-4 py-2 bg-red-600/20 border border-red-600/50 rounded-lg">
                  <span className="text-sm font-bold text-red-400 uppercase tracking-wider">
                    {selectedCategory}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50 border-b-2 border-neutral-200">
                  <th className="text-left py-4 px-5 font-black text-sm uppercase tracking-wider text-neutral-700">
                    <div className="flex items-center gap-2">
                      <span className="w-7 h-7 bg-neutral-800 text-white rounded flex items-center justify-center text-xs">#</span>
                      Pos
                    </div>
                  </th>
                  <th className="text-left py-4 px-5 font-black text-sm uppercase tracking-wider text-neutral-700">Driver</th>
                  <th className="text-left py-4 px-5 font-black text-sm uppercase tracking-wider text-neutral-700">Team / Sponsor</th>
                  <th className="text-left py-4 px-5 font-black text-sm uppercase tracking-wider text-neutral-700">Vehicle</th>
                  <th className="text-left py-4 px-5 font-black text-sm uppercase tracking-wider text-neutral-700">Class</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, idx) => (
                  <tr 
                    key={idx} 
                    className="border-b border-neutral-100 hover:bg-red-50/50 transition-all duration-200 group"
                  >
                    <td className="py-5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-neutral-800 to-neutral-900 text-white rounded-lg flex items-center justify-center font-black text-xl shadow-md group-hover:scale-110 transition-transform">
                          {entry.number}
                        </div>
                      </div>
                    </td>
                    <td className="py-5 px-5">
                      <div className="font-bold text-neutral-900 text-base uppercase tracking-wide">
                        {entry.driver}
                      </div>
                    </td>
                    <td className="py-5 px-5">
                      <div className="text-neutral-600 text-sm leading-tight max-w-xs">
                        {entry.team || '-'}
                      </div>
                    </td>
                    <td className="py-5 px-5">
                      <div className="text-neutral-700 text-base font-medium">
                        {entry.vehicle || '-'}
                      </div>
                    </td>
                    <td className="py-5 px-5">
                      <span className="inline-flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
                        </svg>
                        {entry.category}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

