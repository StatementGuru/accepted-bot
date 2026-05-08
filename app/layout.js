import "./globals.css";
import { AuthProvider } from "./components/AuthProvider";

export const metadata = {
  title: "accepted.bot — UC Essay Coach",
  description: "AI essay coaching powered by Statement Guru methodology",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
