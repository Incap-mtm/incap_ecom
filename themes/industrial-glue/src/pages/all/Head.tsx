import React from 'react';

export default function Head() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --color-incap-blue: #2A4899;
          --color-incap-green: #85C639;
          --color-incap-black: #181B1C;
          --font-heading: 'Sora', sans-serif;
          --font-body: 'Inter', sans-serif;
        }
        body {
          font-family: var(--font-body);
          background-color: #ffffff;
          color: var(--color-incap-black);
        }
        h1, h2, h3, h4, h5, h6 {
          font-family: var(--font-heading);
        }
        .bg-incap-blue { background-color: var(--color-incap-blue); }
        .bg-incap-green { background-color: var(--color-incap-green); }
        .text-incap-blue { color: var(--color-incap-blue); }
        .text-incap-green { color: var(--color-incap-green); }
      `}</style>
    </>
  );
}

export const layout = {
  areaId: 'head',
  sortOrder: 1
};
