export default function ({ visible, children }) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: !visible && 'none',
      }}
    >
      {children}
    </div>
  );
}
