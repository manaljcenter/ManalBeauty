import { Metadata } from 'next';
import SignUpForm from '@/components/auth/SignUpForm';
import ClientLayout from '@/components/client/ClientLayout';

export const metadata: Metadata = {
  title: '╪Ñ┘å╪┤╪º╪í ╪¡╪│╪º╪¿ ╪¼╪»┘è╪» | ┘à┘å╪º┘ä ╪¿┘è┘ê╪¬┘è',
  description: '╪Ñ┘å╪┤╪º╪í ╪¡╪│╪º╪¿ ╪¼╪»┘è╪» ┘ü┘è ┘à┘å╪º┘ä ╪¿┘è┘ê╪¬┘è ┘ä┘ä┘ê╪╡┘ê┘ä ╪Ñ┘ä┘ë ╪«╪»┘à╪º╪¬┘å╪º',
};

export default function RegisterPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto py-10 px-4 max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-pink-700">╪Ñ┘å╪┤╪º╪í ╪¡╪│╪º╪¿ ╪¼╪»┘è╪»</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <SignUpForm />
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              ┘ä╪»┘è┘â ╪¡╪│╪º╪¿ ╪¿╪º┘ä┘ü╪╣┘ä╪ƒ{' '}
              <a href="/client/login" className="text-pink-600 hover:underline">
                ╪¬╪│╪¼┘è┘ä ╪º┘ä╪»╪«┘ê┘ä
              </a>
            </p>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
} 