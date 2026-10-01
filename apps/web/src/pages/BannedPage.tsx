import React from "react";

const BannedPage: React.FC = () => {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "20px",
      textAlign: "center"
    }}>
      <div style={{
        fontSize: "80px",
        marginBottom: "24px"
      }}>🚫</div>
      <h1 style={{
        fontSize: "32px",
        fontWeight: "700",
        color: "#dc2626",
        marginBottom: "12px"
      }}>Tài khoản của bạn đã bị khóa</h1>
      <p style={{
        fontSize: "16px",
        color: "#666",
        maxWidth: "400px"
      }}>Vui lòng liên hệ với quản trị viên nếu bạn nghĩ đây là nhầm lẫn.</p>
    </div>
  );
};

export default BannedPage;