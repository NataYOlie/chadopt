import './globals.css'
import { Inter } from 'next/font/google'
import Provider from "@/app/components/provider/Provider";
import Nav from "@/app/components/nav/Nav";
import Footer from "@/app/components/footer/Footer";

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Chadopt\'',
  description: 'N\'achetez pas, Chadoptez !',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>
        <Provider>
            <main className="app">
                <Nav />
                <div className="main">
                    {children}
                </div>
                <Footer />
            </main>
        </Provider>
      </body>
    </html>
  )
}
