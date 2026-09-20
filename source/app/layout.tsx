import type { Metadata } from 'next';
import './globals.css';
export const metadata: Metadata = {title:'Rafael Deusto — Desarrollador de software',description:'Portfolio de Rafael Deusto Espinosa. Desarrollo web con Python, Django, Java y JavaScript. Descubre PadelBracket y Tesis.',icons:{icon:'/favicon.svg',shortcut:'/favicon.svg'}};
export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="es"><body>{children}</body></html>}
