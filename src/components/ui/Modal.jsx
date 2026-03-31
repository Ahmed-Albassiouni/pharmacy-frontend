import { useLanguage } from '../../context/LanguageContext';

function Modal({ isOpen, onClose, title, children, width = '760px' }) {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop-custom" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="modal-shell" style={{ width: `min(${width}, 96vw)` }} onClick={(event) => event.stopPropagation()}>
        <div className="d-flex justify-content-between align-items-center border-bottom p-3">
          <h5 className="mb-0">{title}</h5>
          <button type="button" className="btn-close" onClick={onClose} aria-label={t('common.close')} />
        </div>
        <div className="p-3">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
