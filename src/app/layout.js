import "./globals.css";

export const metadata = {
  title: "LinkedInPreview | Post Formatter",
  description: "Craft LinkedIn posts with bold, italics, emojis, and real-time preview.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
