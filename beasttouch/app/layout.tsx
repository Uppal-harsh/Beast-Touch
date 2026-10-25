import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'BeastTouch — Made of the streets.', description: 'An independent sneaker concept. Indian soul. Unapologetic soles. Step inside the BeastTouch universe.' };
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
