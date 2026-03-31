import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';

function ToastViewport() {
  const { toasts, removeToast } = useToast();
  const { t } = useLanguage();

  return (
    <div className="toast-host">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast-item ${toast.type}`}>
          <div className="d-flex justify-content-between align-items-start p-3">
            <div className="pe-2">
              <strong className="text-capitalize d-block mb-1">{t(`values.toastType.${toast.type}`)}</strong>
              <span>{toast.message}</span>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label={t('common.close')}
              onClick={() => removeToast(toast.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default ToastViewport;
