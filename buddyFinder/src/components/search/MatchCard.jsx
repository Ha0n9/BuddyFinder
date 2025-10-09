import Button from '../common/Button';

function MatchCard({ match, onRequest }) {
  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="text-lg font-bold">{match.name}</h3>
      <p><strong>Interests:</strong> {match.interests}</p>
      <p><strong>Location:</strong> {match.location}</p>
      <p><strong>Availability:</strong> {match.availability}</p>
      <Button onClick={() => onRequest(match.id)}>Send Buddy Request</Button>
    </div>
  );
}

export default MatchCard;