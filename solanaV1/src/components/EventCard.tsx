import React, { useState } from 'react';
import { Event, WalletState } from '../types';
import { Trophy, TrendingUp, AlertCircle } from 'lucide-react';

interface EventCardProps {
  event: Event;
  wallet: WalletState;
  onPlaceBet: (eventId: string, prediction: string, amount: number) => void;
}

export function EventCard({ event, wallet, onPlaceBet }: EventCardProps) {
  const [amount, setAmount] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);

  const handleBet = () => {
    if (selectedTeam && amount) {
      onPlaceBet(event.id, selectedTeam, parseFloat(amount));
      setAmount('');
      setSelectedTeam(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{event.title}</h3>
          <p className="text-gray-600">{new Date(event.startTime).toLocaleString()}</p>
        </div>
        <Trophy className="h-6 w-6 text-indigo-600" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div 
          className={`p-4 rounded-lg ${
            selectedTeam === 'home' 
              ? 'bg-indigo-100 border-2 border-indigo-600' 
              : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
          }`}
          onClick={() => setSelectedTeam('home')}
        >
          <p className="font-semibold">{event.homeTeam}</p>
          <p className="text-lg text-indigo-600">x{event.odds.home.toFixed(2)}</p>
        </div>
        
        <div 
          className={`p-4 rounded-lg ${
            selectedTeam === 'away' 
              ? 'bg-indigo-100 border-2 border-indigo-600' 
              : 'bg-gray-50 hover:bg-gray-100 cursor-pointer'
          }`}
          onClick={() => setSelectedTeam('away')}
        >
          <p className="font-semibold">{event.awayTeam}</p>
          <p className="text-lg text-indigo-600">x{event.odds.away.toFixed(2)}</p>
        </div>
      </div>

      {event.prediction && (
        <div className="mb-6 p-4 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            <h4 className="font-semibold text-green-800">AI Prediction</h4>
          </div>
          <p className="text-green-800">
            Predicted Winner: {event.prediction.winner} ({event.prediction.confidence}% confidence)
          </p>
          <p className="text-sm text-green-700 mt-2">{event.prediction.analysis}</p>
        </div>
      )}

      {wallet.connected ? (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stake Amount (SOL)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="0.0"
              min="0"
              step="0.1"
            />
          </div>
          
          <button
            onClick={handleBet}
            disabled={!selectedTeam || !amount}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Place Bet
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-2 text-gray-600 p-4 bg-gray-50 rounded-lg">
          <AlertCircle className="h-5 w-5" />
          <p>Connect wallet to place bets</p>
        </div>
      )}
    </div>
  );
}