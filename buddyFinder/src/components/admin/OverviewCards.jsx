// src/components/admin/OverviewCards.jsx
// import React from "react";

const OverviewCards = ({ stats }) => {
  if (!stats) return null;

  const cards = [
    { title: "Total Users", value: stats.totalUsers },
    { title: "Active Users", value: stats.activeUsers },
    { title: "Total Activities", value: stats.totalActivities },
    { title: "Total Matches", value: stats.totalMatches },
    { title: "Total Messages", value: stats.totalMessages },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
      {cards.map((c) => (
        <div
          key={c.title}
          className="p-5 bg-white dark:bg-gray-800 shadow rounded-lg text-center"
        >
          <h3 className="text-gray-500 dark:text-gray-300">{c.title}</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {c.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default OverviewCards;
