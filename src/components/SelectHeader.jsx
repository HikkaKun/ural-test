export default function SelectHeader({ value, onChange, title, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="form-select form-select-sm border-0 shadow-none bg-transparent"
      style={{
        cursor: 'pointer',
        width: '100%',
        padding: 0,
        paddingRight: '1.1rem',
        backgroundPosition: 'right center',
        fontWeight: 'inherit',
        fontSize: 'inherit',
        color: 'inherit',
      }}
      aria-label={title}
      title={title}
    >
      {children}
    </select>
  )
}
