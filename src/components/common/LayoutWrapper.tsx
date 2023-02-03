import { ReactNode } from 'react';

import Drawer from '@/components/common/Drawer';
import Header from '@/components/common/Header';

interface Props {
  children: ReactNode;
  className?: string;
}

const LayoutWrapper = ({ children, className }: Props) => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 items-stretch bg-gray-50 pt-14">
        <Drawer />
        <main className={`flex-1 p-4 ${className ?? ''}`}>{children}</main>
      </div>
    </div>
  );
};

export default LayoutWrapper;
