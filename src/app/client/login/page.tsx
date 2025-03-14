import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';
import ClientLayout from '@/components/client/ClientLayout';

export const metadata: Metadata = {
  title: '╪¬╪│╪¼┘è┘ä ╪º┘ä╪»╪«┘ê┘ä | ┘à┘å╪º┘ä ╪¿┘è┘ê╪¬┘è',
  description: '╪¬╪│╪¼┘è┘ä ╪º┘ä╪»╪«┘ê┘ä ╪Ñ┘ä┘ë ╪¡╪│╪º╪¿┘â ┘ü┘è ┘à┘å╪º┘ä ╪¿┘è┘ê╪¬┘è',
};

export default function LoginPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-700">╪¬╪│╪¼┘è┘ä ╪º┘ä╪»╪«┘ê┘ä</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <LoginForm />
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ┘ä┘è╪│ ┘ä╪»┘è┘â ╪¡╪│╪º╪¿╪ƒ{' '}
              <a href="/client/register" className="text-pink-600 hover:underline">
                ╪Ñ┘å╪┤╪º╪í ╪¡╪│╪º╪¿
              </a>
            </p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 