import "./globals.css";
import Providers from "@/providers/ChakraProviders";
import { AuthProvider } from "@/providers/AuthProvider";
import AuthGate from "@/components/AuthGate";
import NavBar from "@/components/NavBar";

export const metadata = {
  title: "Invoice App",
  description: "Next.js Invoice App with Firebase",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AuthProvider>
            <NavBar />
            <AuthGate>
              {children}
            </AuthGate>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
