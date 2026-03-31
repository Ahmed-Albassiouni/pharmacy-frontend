import { useLanguage } from '../../context/LanguageContext';

function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="mt-auto py-4 border-top footer-surface">
      <div className="container-xl d-flex flex-column flex-md-row gap-3 justify-content-between align-items-center">
        <p className="mb-0 text-muted">
          {t('footer.copy', { year: new Date().getFullYear() })}
        </p>
        <div className="d-flex gap-3 text-muted small">
          <span>{t('footer.support247')}</span>
          <span>{t('footer.fastDelivery')}</span>
          <span>{t('footer.prescriptionUpload')}</span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
