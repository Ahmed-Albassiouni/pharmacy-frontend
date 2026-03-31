import { useState } from 'react';
import { submitConsultation } from '../api/pharmacyApi';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

function ConsultationPage() {
  const { showToast } = useToast();
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    question: '',
    prescriptionFile: null,
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append('fullName', form.fullName);
      payload.append('email', form.email);
      payload.append('phone', form.phone);
      payload.append('question', form.question);
      if (form.prescriptionFile) {
        payload.append('prescription', form.prescriptionFile);
      }

      const response = await submitConsultation(payload);
      setTicket(response.ticketId);
      showToast(t('consultation.submittedToast'), 'success');
      setForm({
        fullName: '',
        email: '',
        phone: '',
        question: '',
        prescriptionFile: null,
      });
    } catch {
      showToast(t('consultation.failedToast'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-shell mt-4">
      <div className="row g-3">
        <div className="col-lg-7">
          <form className="card-soft p-3 p-md-4" onSubmit={handleSubmit}>
            <h1 className="display-font mb-2">{t('consultation.title')}</h1>
            <p className="text-muted mb-4">
              {t('consultation.subtitle')}
            </p>

            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">{t('consultation.fullName')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.fullName}
                  onChange={(event) => handleChange('fullName', event.target.value)}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">{t('consultation.phoneNumber')}</label>
                <input
                  type="text"
                  className="form-control"
                  value={form.phone}
                  onChange={(event) => handleChange('phone', event.target.value)}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">{t('consultation.email')}</label>
                <input
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={(event) => handleChange('email', event.target.value)}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">{t('consultation.question')}</label>
                <textarea
                  rows="5"
                  className="form-control"
                  placeholder={t('consultation.questionPlaceholder')}
                  value={form.question}
                  onChange={(event) => handleChange('question', event.target.value)}
                  required
                />
              </div>

              <div className="col-12">
                <label className="form-label">{t('consultation.uploadPrescription')}</label>
                <input
                  type="file"
                  className="form-control"
                  accept="application/pdf,image/*"
                  onChange={(event) => handleChange('prescriptionFile', event.target.files?.[0] || null)}
                />
              </div>
            </div>

            <button className="btn btn-brand mt-4" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('consultation.submitting') : t('consultation.sendButton')}
            </button>
          </form>
        </div>

        <div className="col-lg-5">
          <div className="card-soft p-3 p-md-4 h-100">
            <h4 className="mb-3">{t('consultation.howItWorks')}</h4>
            <ol className="small d-grid gap-2">
              <li>{t('consultation.step1')}</li>
              <li>{t('consultation.step2')}</li>
              <li>{t('consultation.step3')}</li>
            </ol>
            <div className="alert alert-success mt-3 mb-0">
              {t('consultation.secureNotice')}
            </div>

            {ticket && (
              <div className="mt-3 p-3 rounded bg-light border">
                <strong>{t('consultation.ticket')}</strong>
                <div>{ticket}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ConsultationPage;
