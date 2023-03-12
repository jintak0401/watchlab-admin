import { Spinner } from 'flowbite-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="fixed left-0 top-0 z-50 flex h-screen w-screen flex-col items-center justify-center gap-4 bg-gray-50">
      <NextImage
        src="/static/images/simryun.png"
        alt="simryun"
        width="300"
        height="300"
        unoptimized
      />
      <h1 className="text-4xl font-bold">SIMRYUN</h1>
      <Link
        onClick={() => setLoading(true)}
        href={`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/login`}
        className="h-12 w-56 rounded-xl bg-white px-5 py-2 text-xl font-semibold text-black/[54%] shadow-md hover:shadow-xl"
      >
        {loading ? (
          <center>
            <Spinner />
          </center>
        ) : (
          <div className="flex items-center justify-between">
            <FcGoogle className="!h-7" />
            <span className="flex-1 text-center">Google Login</span>
          </div>
        )}
      </Link>
    </div>
  );
}
