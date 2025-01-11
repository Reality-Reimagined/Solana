import React from 'react';
import { Prediction } from '../types';
import { CheckCircle, Clock } from 'lucide-react';

interface PredictionsListProps {
  predictions: Prediction[];
  onClaim: (predictionId: string) => void;
}

export function PredictionsList({ predictions, onClaim }: PredictionsListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">Your Predictions</h2>
      
      {predictions.length === 0 ? (
        <p className="text-gray-600">No active predictions</p>
      ) : (
        predictions.map((prediction) => (
          <div 
            key={prediction.eventId}
            className="bg-white rounded-lg shadow p-4 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">Predicted: {prediction.prediction}</p>
              <p className="text-sm text-gray-600">
                Stake: {prediction.amount} SOL
              </p>
              <p className="text-xs text-gray-500">
                {new Date(prediction.timestamp).toLocaleString()}
              </p>
            </div>
            
            {prediction.claimed ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="h-5 w-5 mr-1" />
                <span>Claimed</span>
              </div>
            ) : (
              <button
                onClick={() => onClaim(prediction.eventId)}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <Clock className="h-4 w-4 mr-1" />
                Claim
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}