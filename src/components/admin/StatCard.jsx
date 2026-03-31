function StatCard({ title, value, icon, background }) {
  return (
    <div className="stat-card" style={{ background }}>
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <small className="text-uppercase opacity-75">{title}</small>
          <h3 className="mb-0 mt-2">{value}</h3>
        </div>
        <span className="fs-4">
          <i className={`bi ${icon}`} />
        </span>
      </div>
    </div>
  );
}

export default StatCard;
