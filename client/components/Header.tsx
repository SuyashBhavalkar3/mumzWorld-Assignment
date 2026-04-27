import React from 'react';
import { Search, ShoppingCart, User, Menu, Globe } from 'lucide-react';

interface HeaderProps {
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
}

export default function Header({ lang, setLang }: HeaderProps) {
  const isAr = lang === 'ar';
  
  return (
    <header className="w-full bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-8">
        {/* Mobile Menu */}
        <button className="lg:hidden text-primary">
          <Menu size={24} />
        </button>

        {/* Logo - Fixed on the left */}
        <div className="flex-shrink-0">
          <div className="text-primary font-black text-2xl tracking-tighter flex items-center">
            mumz<span className="text-secondary">world</span>
            <span className="ml-2 px-2 py-0.5 bg-accent text-[8px] rounded-full text-mumz-grey font-black">
              {isAr ? 'درع الذكاء الاصطناعي' : 'SHIELD AI'}
            </span>
          </div>
        </div>

        {/* Search Bar - Fixed in center */}
        <div className="hidden lg:flex flex-grow max-w-2xl relative">
          <input 
            type="text" 
            placeholder={isAr ? "ابحث عن عربات الأطفال، الألعاب، الحفاضات..." : "Search for strollers, toys, diapers..."} 
            className={`w-full h-12 bg-gray-50 border-none rounded-full px-12 focus:ring-2 focus:ring-primary/20 text-sm transition-all ${isAr ? 'text-right' : ''}`}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        </div>

        {/* Action Buttons - Fixed on the right */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setLang(isAr ? 'en' : 'ar')}
            className={`flex flex-col items-center gap-1 transition-colors ${isAr ? 'text-primary' : 'text-gray-500 hover:text-primary'}`}
          >
            <Globe size={20} />
            <span className="text-[10px] font-black">{isAr ? 'ENGLISH' : 'العربية'}</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors">
            <User size={20} />
            <span className="text-[10px] font-black">{isAr ? 'حسابي' : 'ACCOUNT'}</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-primary transition-colors relative">
            <ShoppingCart size={20} />
            <span className="text-[10px] font-black">{isAr ? 'السلة' : 'CART'}</span>
            <span className="absolute -top-1 -right-1 bg-accent text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-black">0</span>
          </button>
        </div>
      </div>
    </header>
  );
}
