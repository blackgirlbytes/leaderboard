import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, TableHeader } from './ui/table';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { Typography } from './ui/typography';

const LeaderboardRow = ({ rank, username, points, prs }) => (
  <TableRow>
    <TableCell>{rank}</TableCell>
    <TableCell>{username}</TableCell>
    <TableCell>{points}</TableCell>
    <TableCell>{prs}</TableCell>
  </TableRow>
);

const HacktoberfestLeaderboard = ({ initialData }) => {
  const [leaderboard] = useState(initialData);
  const [error] = useState(null);

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="p-4">
      <Typography variant="h4" className="mb-4">Hacktoberfest Leaderboard</Typography>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Points</TableHead>
              <TableHead>PRs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leaderboard.map((entry) => (
              <LeaderboardRow key={entry.username} {...entry} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default HacktoberfestLeaderboard;