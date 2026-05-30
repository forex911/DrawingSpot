import { useState, useEffect, useRef } from "react";
import API from "../../api/axiosConfig";
import { useAuth } from "../../context/AuthContext";
import { FaBell, FaCommentDots, FaPaperPlane, FaTimes, FaArrowLeft, FaHeadset, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../App.css";

function formatTime(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

function UserChat({ conversationUserId, isAdminView = false, isDashboardView = false, onCloseAdmin }) {
    const { userId, userName, isChatOpen, setIsChatOpen, isAuthenticated } = useAuth();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [toastMsg, setToastMsg] = useState(null);
    const [hasOrders, setHasOrders] = useState(null); // null = loading, true/false = result
    const chatEndRef = useRef(null);
    const pollerRef = useRef(null);
    const prevMessagesLength = useRef(0);

    // If we're the admin, we send as `userId` (the admin's ID).
    // If we're the user, we send as `userId`.
    const currentUserId = userId;

    const fetchMessages = async (silent = false) => {
        if (!silent) setLoading(true);
        try {
            const res = await API.get(`/chat/user/${conversationUserId}`);
            setMessages(res.data);
        } catch (err) {
            console.error("Error fetching chat messages:", err);
        } finally {
            if (!silent) setLoading(false);
        }
    };

    // Check if user has placed at least one order (non-admin only)
    useEffect(() => {
        if (!isAdminView && conversationUserId && isAuthenticated) {
            API.get(`/orders/user/${conversationUserId}`)
                .then(res => setHasOrders(Array.isArray(res.data) && res.data.length > 0))
                .catch(() => setHasOrders(true)); // fail open — don't lock on error
        } else if (isAdminView) {
            setHasOrders(true); // admin always has access
        }
    }, [conversationUserId, isAuthenticated, isAdminView]);

    useEffect(() => {
        if (conversationUserId && isAuthenticated) {
            fetchMessages();
            // Poll for new messages every 5 seconds
            pollerRef.current = setInterval(() => fetchMessages(true), 5000);
        }
        return () => clearInterval(pollerRef.current);
    }, [conversationUserId, isAuthenticated]);

    useEffect(() => {
        if ("Notification" in window && Notification.permission === "default") {
            Notification.requestPermission();
        }
    }, []);

    useEffect(() => {
        // Check for new messages to show a notification
        if (messages.length > prevMessagesLength.current) {
            if (prevMessagesLength.current > 0) {
                const newMsgs = messages.slice(prevMessagesLength.current);
                const latestExternal = newMsgs.reverse().find(m => String(m.sender?.id) !== String(currentUserId));
                if (latestExternal) {
                    // Show in-app visual notification
                    setToastMsg(`New message from ${isAdminView ? "Customer" : "Admin"}`);
                    setTimeout(() => setToastMsg(null), 4000);

                    if ("Notification" in window && Notification.permission === "granted") {
                        const title = isAdminView ? "New message from Customer" : "New message from Admin";
                        new Notification(title, { body: latestExternal.content });
                    }
                }
            }

            // If we have messages, and there's an unread message NOT sent by us, automatically mark the conversation as read
            const hasUnreadExternalMessages = messages.some(
                m => String(m.sender?.id) !== String(currentUserId) && !m.read
            );
            // In admin view, it's always open if mounted. In user view, check isChatOpen.
            if (hasUnreadExternalMessages && (isAdminView || isChatOpen)) {
                API.put(`/chat/user/${conversationUserId}/read?readerId=${currentUserId}`).catch(err => console.error("Could not mark as read", err));
            }

            prevMessagesLength.current = messages.length;
        }

        // Auto-scroll to bottom on new messages
        if ((isAdminView || isChatOpen) && chatEndRef.current && chatEndRef.current.parentNode) {
            chatEndRef.current.parentNode.scrollTop = chatEndRef.current.parentNode.scrollHeight;
        }
    }, [messages, currentUserId, isAdminView, isChatOpen, conversationUserId]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !currentUserId) return;

        setSending(true);
        try {
            await API.post(`/chat/user/${conversationUserId}`, {
                senderId: currentUserId,
                content: newMessage.trim(),
            });
            setNewMessage("");
            fetchMessages(true); // refresh immediately
        } catch (err) {
            console.error("Error sending message:", err);
            alert("Failed to send message.");
        } finally {
            setSending(false);
        }
    };

    const isVisible = isAdminView || isChatOpen;

    if (!isVisible || !isAuthenticated) {
        return null;
    }

    // ── Locked placeholder for users with no orders ──
    if (!isAdminView && hasOrders === false) {
        return (
            <div className="user-chat-wrapper" style={{ bottom: 20, right: 20, zIndex: 9999 }}>
                <div className="user-chat-popup" style={{ display: "flex", flexDirection: "column" }}>
                    {/* Header */}
                    <div style={{
                        padding: "12px 16px",
                        borderBottom: "1px solid var(--border)",
                        background: "rgba(0,0,0,0.05)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <FaCommentDots style={{ fontSize: "1.2rem", color: "var(--gold)" }} />
                            <div>
                                <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text)" }}>Customer Support</h4>
                                <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted)" }}>Chat with Admin</p>
                            </div>
                        </div>
                        <button onClick={() => setIsChatOpen(false)} style={{
                            background: "transparent", border: "none",
                            color: "var(--muted)", cursor: "pointer", fontSize: "1.1rem",
                            display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                            <FaTimes />
                        </button>
                    </div>

                    {/* Locked Body */}
                    <div style={{
                        flex: 1, display: "flex", flexDirection: "column",
                        alignItems: "center", justifyContent: "center",
                        padding: "32px 24px", textAlign: "center", gap: 16,
                    }}>
                        <div style={{
                            width: 60, height: 60, borderRadius: "50%",
                            background: "rgba(0,0,0,0.1)",
                            border: "1.5px solid rgba(0,0,0,0.3)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.5rem", color: "var(--gold)"
                        }}>
                            <FaLock />
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", marginBottom: 8 }}>
                                Support Chat Locked
                            </p>
                            <p style={{ fontSize: "0.82rem", color: "var(--muted)", lineHeight: 1.6 }}>
                                Place your first order to unlock<br />direct contact with our support team.
                            </p>
                        </div>
                        <Link
                            to="/order"
                            onClick={() => setIsChatOpen(false)}
                            style={{
                                marginTop: 8, padding: "10px 24px", borderRadius: 8,
                                background: "var(--gold)", color: "#000",
                                fontWeight: 700, fontSize: "0.85rem",
                                textDecoration: "none", display: "inline-block",
                                transition: "opacity 0.2s"
                            }}
                        >
                            Place an Order →
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const content = (
        <>
            {/* ── Visual Popup Notification (user view only) ── */}
            {toastMsg && !isAdminView && (
                <div style={{
                    position: "absolute",
                    top: 10,
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--gold)",
                    color: "#000",
                    padding: "8px 16px",
                    borderRadius: 20,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    zIndex: 100,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    animation: "pulse 1.5s infinite"
                }}>
                    <FaBell /> {toastMsg}
                </div>
            )}

            {/* Chat Header */}
            <div style={{
                padding: "12px 16px",
                borderBottom: "1px solid var(--border)",
                background: "rgba(0,0,0,0.05)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {isAdminView && onCloseAdmin && (
                        <button
                            onClick={onCloseAdmin}
                            style={{
                                background: "var(--card)",
                                border: "1px solid var(--border)",
                                borderRadius: "8px",
                                color: "var(--text)",
                                cursor: "pointer",
                                width: 32,
                                height: 32,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginRight: 4,
                                transition: "all 0.2s"
                            }}
                        >
                            <FaArrowLeft />
                        </button>
                    )}
                    {isDashboardView ? (
                        <FaHeadset style={{ fontSize: "1.2rem", color: "var(--gold)" }} />
                    ) : (
                        <FaCommentDots style={{ fontSize: "1.2rem", color: "var(--gold)" }} />
                    )}
                    <div>
                        <h4 style={{ margin: 0, fontSize: "0.95rem", color: "var(--text)" }}>
                            {isDashboardView ? "Chat with Support" : "Customer Support"}
                        </h4>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: "var(--muted)" }}>
                            {isAdminView ? `Chatting with Customer #${conversationUserId}` : (isDashboardView ? "We typically reply in a few minutes" : "Chat with Admin")}
                        </p>
                    </div>
                </div>
                {/* Close Button only for floating view */}
                {!isAdminView && !isDashboardView && (
                    <button onClick={() => setIsChatOpen(false)} style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--muted)",
                        cursor: "pointer",
                        fontSize: "1.1rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                        <FaTimes />
                    </button>
                )}
            </div>

            {/* Messages Area */}
            <div style={{
                flex: 1,
                padding: "16px 16px 8px 16px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                minHeight: 0
            }}>
                {messages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "var(--muted)", margin: "auto", fontSize: "0.85rem" }}>
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg, i) => {
                        const isMe = String(msg.sender?.id) === String(currentUserId);
                        const isRead = msg.read === true;

                        return (
                            <div
                                key={msg.id || i}
                                style={{
                                    display: "flex",
                                    justifyContent: isMe ? "flex-end" : "flex-start",
                                    marginBottom: 8
                                }}
                            >
                                <div style={{ maxWidth: "85%" }}>
                                    <div style={{
                                        fontSize: "0.65rem",
                                        color: "var(--muted)",
                                        marginBottom: 2,
                                        textAlign: isMe ? "right" : "left",
                                        textTransform: "lowercase",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: isMe ? "flex-end" : "flex-start",
                                        gap: 4
                                    }}>
                                        {msg.sender?.name || (isAdminView && !isMe ? "Customer" : "Admin")}
                                        <span style={{ opacity: 0.5 }}>·</span>
                                        {formatTime(msg.sentAt)}
                                    </div>
                                    <div style={{
                                        padding: "10px 14px",
                                        borderRadius: isMe ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                                        background: isMe ? "var(--gold)" : "var(--surface)",
                                        color: isMe ? "#000" : "var(--text)",
                                        fontSize: "0.9rem",
                                        lineHeight: 1.4,
                                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                                        display: "flex",
                                        alignItems: "flex-end",
                                        gap: 8,
                                        wordBreak: "break-word"
                                    }}>
                                        <span>{msg.content}</span>
                                        {isMe && (
                                            <span style={{
                                                fontSize: "0.6rem",
                                                marginLeft: "auto",
                                                fontWeight: 600,
                                                letterSpacing: "0.03em",
                                                color: isRead ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)",
                                                lineHeight: 1,
                                                display: "inline-flex",
                                                alignItems: "center",
                                                paddingLeft: 6,
                                                flexShrink: 0,
                                                textTransform: "uppercase",
                                            }}>
                                                {isRead ? "··" : "·"}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} style={{
                padding: "10px 12px",
                borderTop: "1px solid var(--border)",
                display: "flex",
                gap: 8,
                background: "var(--bg)",
                alignItems: "center"
            }}>
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    disabled={sending}
                    style={{
                        flex: 1,
                        padding: "10px 14px",
                        borderRadius: 20,
                        border: "1px solid var(--border)",
                        background: "var(--card)",
                        color: "var(--text)",
                        outline: "none",
                        fontSize: "0.9rem",
                        width: "100%"
                    }}
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    style={{
                        background: "var(--gold)",
                        color: "#000",
                        border: "none",
                        borderRadius: "50%",
                        width: 40,
                        height: 40,
                        minWidth: 40,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: (!newMessage.trim() || sending) ? "not-allowed" : "pointer",
                        opacity: (!newMessage.trim() || sending) ? 0.6 : 1,
                        transition: "opacity 0.2s"
                    }}
                >
                    <FaPaperPlane />
                </button>
            </form>
        </>
    );

    if (isAdminView) {
        return (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1, position: "relative" }}>
                {content}
            </div>
        );
    }

    return (
        <div className="user-chat-wrapper" style={{ bottom: 20, right: 20, zIndex: 9999 }}>
            <div className="user-chat-popup">
                {content}
            </div>
        </div>
    );
}

export default UserChat;
