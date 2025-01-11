import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { EventCard } from '../components/EventCard';
import { PredictionsList } from '../components/PredictionsList';
import { Event, Prediction, WalletState } from '../types';
import { useAppKit } from '@reown/appkit/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Generate next week's games
const generateGames = () => {
  const teams = [
    { name: 'Lakers', city: 'Los Angeles' },
    { name: 'Warriors', city: 'Golden State' },
    { name: 'Celtics', city: 'Boston' },
    { name: 'Nets', city: 'Brooklyn' },
    { name: 'Heat', city: 'Miami' },
    { name: 'Bucks', city: 'Milwaukee' },
    { name: '76ers', city: 'Philadelphia' },
    { name: 'Suns', city: 'Phoenix' }
  ];

  const games: Event[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Generate 2-3 games per day
    const gamesPerDay = Math.floor(Math.random() * 2) + 2;
    
    for (let j = 0; j < gamesPerDay; j++) {
      const homeIndex = Math.floor(Math.random() * teams.length);
      let awayIndex = Math.floor(Math.random() * teams.length);
      while (awayIndex === homeIndex) {
        awayIndex = Math.floor(Math.random() * teams.length);
      }

      const homeTeam = teams[homeIndex];
      const awayTeam = teams[awayIndex];

      // Generate realistic odds
      const homeOdds = Number((1 + Math.random() * 2).toFixed(2));
      const awayOdds = Number((1 + Math.random() * 2).toFixed(2));

      games.push({
        id: `${date.toISOString()}-${homeTeam.name}-${awayTeam.name}`,
        title: 'NBA Regular Season',
        sport: 'Basketball',
        startTime: date.toISOString(),
        homeTeam: `${homeTeam.city} ${homeTeam.name}`,
        awayTeam: `${awayTeam.city} ${awayTeam.name}`,
        odds: { home: homeOdds, away: awayOdds },
        prediction: {
          winner: Math.random() > 0.5 ? homeTeam.name : awayTeam.name,
          confidence: Math.floor(55 + Math.random() * 30),
          analysis: `Based on recent performance metrics and historical matchups, ${
            Math.random() > 0.5 ? homeTeam.name : awayTeam.name
          } shows a strong advantage in key areas.`
        }
      });
    }
  }

  return games;
};

const MOCK_EVENTS = generateGames();

// Group events by date
const groupEventsByDate = (events: Event[]) => {
  const grouped = events.reduce((acc, event) => {
    const date = new Date(event.startTime).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  return Object.entries(grouped).sort((a, b) => 
    new Date(a[0]).getTime() - new Date(b[0]).getTime()
  );
};

export function Platform() {
  const navigate = useNavigate();
  const { address, isConnected, open } = useAppKit();
  const [predictions, setPredictions] = React.useState<Prediction[]>([]);
  const groupedEvents = groupEventsByDate(MOCK_EVENTS);

  useEffect(() => {
    const checkConnection = async () => {
      if (!isConnected) {
        try {
          await open();
        } catch (error) {
          navigate('/');
        }
      }
    };

    checkConnection();
  }, [isConnected, navigate, open]);

  const wallet: WalletState = {
    connected: isConnected,
    address: address || null,
    balance: 10.5
  };

  const handlePlaceBet = async (eventId: string, prediction: string, amount: number) => {
    try {
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
      setPredictions(predictions.map(p => 
        p.eventId === predictionId ? { ...p, claimed: true } : p
      ));
    } catch (error) {
      console.error('Failed to claim reward:', error);
    }
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header wallet={wallet} onConnect={open} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">NBA Games</h2>
              <Tabs defaultValue={groupedEvents[0][0]} className="w-full">
                <TabsList className="w-full flex overflow-x-auto">
                  {groupedEvents.map(([date]) => (
                    <TabsTrigger key={date} value={date} className="flex-1">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {groupedEvents.map(([date, events]) => (
                  <TabsContent key={date} value={date} className="space-y-4">
                    {events.map(event => (
                      <EventCard
                        key={event.id}
                        event={event}
                        wallet={wallet}
                        onPlaceBet={handlePlaceBet}
                      />
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
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