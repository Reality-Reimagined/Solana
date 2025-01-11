import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { EventCard } from '../components/EventCard';
import { PredictionsList } from '../components/PredictionsList';
import { Event, Prediction, WalletState } from '../types';
import { useAppKit } from '@reown/appkit/react';

// Keep the mock data for now
const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Premier League Match',
    sport: 'Soccer',
    startTime: new Date(Date.now() + 86400000).toISOString(),
    homeTeam: 'Arsenal',
    awayTeam: 'Manchester United',
    odds: { home: 2.1, away: 3.4, draw: 3.2 },
    prediction: {
      winner: 'Arsenal',
      confidence: 75,
      analysis: 'Based on recent form and home advantage, Arsenal has a strong chance of winning.'
    }
  },
  {
    id: '2',
    title: 'NBA Regular Season',
    sport: 'Basketball',
    startTime: new Date(Date.now() + 172800000).toISOString(),
    homeTeam: 'Lakers',
    awayTeam: 'Warriors',
    odds: { home: 1.9, away: 2.1 },
    prediction: {
      winner: 'Warriors',
      confidence: 65,
      analysis: 'Warriors showing strong offensive stats in recent games.'
    }
  }
];

export function Platform() {
  const navigate = useNavigate();
  const { address, isConnected, open } = useAppKit();
  const [predictions, setPredictions] = React.useState<Prediction[]>([]);

  // Redirect to home if not connected
  useEffect(() => {
    const checkConnection = async () => {
      if (!isConnected) {
        await open();
        if (isConnected) {
          navigate('/app'); // Navigate to the platform page if connected
        } else {
          navigate('/'); // Navigate to home if still not connected
        }
      }
    };

    checkConnection();
  }, [isConnected, navigate, open]);

  const wallet: WalletState = {
    connected: isConnected,
    address: address || null,
    balance: 10.5 // This should be fetched from the wallet
  };

  const handlePlaceBet = async (eventId: string, prediction: string, amount: number) => {
    try {
      // This will be replaced with actual smart contract interaction
      const newPrediction: Prediction = {
        eventId,
        prediction,
        amount,
        timestamp: new Date().toISOString(),
        claimed: false
      };
      setPredictions([...predictions, newPrediction]);
    } catch (error) {
      console.error('Failed to place bet:', error);
    }
  };

  const handleClaim = async (predictionId: string) => {
    try {
      // This will be replaced with actual smart contract interaction
      setPredictions(predictions.map(p => 
        p.eventId === predictionId ? { ...p, claimed: true } : p
      ));
    } catch (error) {
      console.error('Failed to claim reward:', error);
    }
  };

  if (!isConnected) {
    return null; // Don't render anything while checking connection
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header wallet={wallet} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Live Events</h2>
            <div className="grid gap-6">
              {MOCK_EVENTS.map(event => (
                <EventCard
                  key={event.id}
                  event={event}
                  wallet={wallet}
                  onPlaceBet={handlePlaceBet}
                />
              ))}
            </div>
          </div>
          
          <div>
            <PredictionsList
              predictions={predictions}
              onClaim={handleClaim}
            />
          </div>
        </div>
      </main>
    </div>
  );
}