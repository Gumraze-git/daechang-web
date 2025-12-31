import { redirect } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function SupportPage() {
  const locale = useLocale();
  redirect(`/${locale}/support/contact`);
}
