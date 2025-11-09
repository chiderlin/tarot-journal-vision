import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant={i18n.language === 'zh' ? 'default' : 'outline'}
        size="sm"
        onClick={() => changeLanguage('zh')}
      >
        中文
      </Button>
      <Button
        variant={i18n.language === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => changeLanguage('en')}
      >
        English
      </Button>
    </div>
  );
};
