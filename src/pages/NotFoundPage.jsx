import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function NotFoundPage() {
  const { t } = useLanguage();

  return (
    <section className="section-shell mt-4">
      <div className="card-soft p-5 text-center">
        <h1 className="display-font">404</h1>
        <p className="text-muted">{t('notFound.text')}</p>
        <Link to="/" className="btn btn-brand">
          {t('notFound.returnHome')}
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
