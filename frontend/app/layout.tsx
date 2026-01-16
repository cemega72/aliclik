import Providers from '../src/components/Providers';

export const metadata = {
  title: 'Aliclik Tech Test',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
